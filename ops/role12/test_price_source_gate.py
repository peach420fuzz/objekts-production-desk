"""Synthetic unit tests; no live provider result or publication permission implied."""
import copy
import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from price_source_gate import assess, utc_datetime

NOW = utc_datetime("2026-11-09T22:00:00Z")

class PriceEvidenceTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.raw = b"SYNTHETIC ONLY: previs from 150000 RUB per scope before tax"
        (self.root / "page.txt").write_bytes(self.raw)
        self.rec = {"id": "synthetic-positive", "kind": "live_http",
                    "source_url": "https://objekts.ai/services/film-series-vfx/",
                    "observed_at": "2026-11-09T21:00:00Z", "http_status": 200,
                    "category": "previs", "artifact": "page.txt",
                    "sha256": hashlib.sha256(self.raw).hexdigest(),
                    "price_excerpt": self.raw.decode(),
                    "price": {"amount": "150000", "currency": "RUB", "unit": "scope",
                              "tax": "before_tax", "basis": "starting_from"}}
    def tearDown(self):
        self.tmp.cleanup()
    def check(self, records=None, **kwargs):
        return assess(records if records is not None else [self.rec], category="previs",
                      currency="RUB", unit="scope", now=NOW, evidence_root=self.root, **kwargs)
    def held(self):
        r = self.check(); self.assertTrue(r["status"].startswith("HOLD"));
        self.assertIsNone(r["candidate_price"]); self.assertFalse(r["publish_allowed"])
    def test_01_positive_is_review_only(self):
        r=self.check(); self.assertEqual(r["status"], "AS_OF_REVIEWABLE")
        self.assertFalse(r["publish_allowed"]); self.assertFalse(r["authenticity_independently_verified"])
    def test_02_search_cache_is_not_current_proof(self):
        self.rec["kind"]="search_cache"; self.held()
    def test_03_previous_note_is_not_live_proof(self):
        self.rec["kind"]="historical_note"; self.held()
    def test_04_wrong_host(self):
        self.rec["source_url"]="https://media.objekts.ai/price"; self.held()
    def test_05_deceptive_suffix(self):
        self.rec["source_url"]="https://objekts.ai.example/price"; self.held()
    def test_06_wrong_service_category(self):
        self.rec["category"]="creative_treatment"; self.held()
    def test_07_stale(self):
        self.rec["observed_at"]="2026-11-01T21:00:00Z"; self.held()
    def test_08_future(self):
        self.rec["observed_at"]="2026-11-10T21:00:00Z"; self.held()
    def test_09_timezone_required(self):
        self.rec["observed_at"]="2026-11-09T21:00:00"; self.held()
    def test_10_currency_cannot_be_converted(self):
        self.rec["price"]["currency"]="USD"; self.held()
    def test_11_tax_unknown(self):
        self.rec["price"]["tax"]=None; self.held()
    def test_12_shot_price_cannot_be_project_price(self):
        self.rec["price"]["unit"]="shot"; self.held()
    def test_13_receipt_id_alone_is_rejected(self):
        self.rec={"id":"invented-provider-message-123","kind":"live_http"}; self.held()
    def test_14_invented_hash_rejected(self):
        self.rec["sha256"]="0"*64; self.held()
    def test_15_missing_capture_rejected(self):
        self.rec["artifact"]="does-not-exist.txt"; self.held()
    def test_16_unrelated_excerpt_rejected(self):
        self.rec["price_excerpt"]="Invented actual quote"; self.held()
    def test_17_path_escape_rejected(self):
        self.rec["artifact"]="../page.txt"; self.held()
    def test_18_negative_amount(self):
        self.rec["price"]["amount"]=-1; self.held()
    def test_19_boolean_is_not_money(self):
        self.rec["price"]["amount"]=True; self.held()
    def test_20_nan_is_not_money(self):
        self.rec["price"]["amount"]="NaN"; self.held()
    def test_21_failed_fetch_not_absence_of_price(self):
        self.rec["http_status"]=503; self.held()
    def test_22_two_conflicting_direct_observations(self):
        b=copy.deepcopy(self.rec); b["id"]="second"; b["price"]["amount"]="200000"
        self.assertEqual(self.check([self.rec,b])["status"],"HOLD_CONFLICTING_DIRECT_OBSERVATIONS")
    def test_23_same_amount_different_tax_conflicts(self):
        b=copy.deepcopy(self.rec); b["price"]["tax"]="tax_included"
        self.assertEqual(self.check([self.rec,b])["status"],"HOLD_CONFLICTING_DIRECT_OBSERVATIONS")
    def test_24_new_good_capture_does_not_authorize_bad_one(self):
        b=copy.deepcopy(self.rec); b["sha256"]="fake"
        self.assertEqual(self.check([self.rec,b])["status"],"HOLD_MIXED_QUALITY_EVIDENCE")
    def test_25_cache_cannot_override_verified_capture(self):
        b={"id":"cache","kind":"search_cache","price":{"amount":"1"}}
        self.assertEqual(self.check([self.rec,b])["candidate_price"]["amount"],"150000")
    def test_26_no_records_means_unknown(self):
        self.assertEqual(self.check([])["status"],"HOLD_NO_CURRENT_DIRECT_EVIDENCE")
    def test_27_duplicate_captures_are_not_independent_votes(self):
        r=self.check([self.rec,copy.deepcopy(self.rec)])
        self.assertEqual(r["status"],"AS_OF_REVIEWABLE"); self.assertFalse(r["publish_allowed"])
    def test_28_unknown_basis(self):
        self.rec["price"]["basis"]="estimate_without_scope"; self.held()
    def test_29_malformed_input(self):
        with self.assertRaises(ValueError): self.check([None])
    def test_30_no_network_success_without_artifact(self):
        del self.rec["artifact"]; self.held()
    def test_31_forged_structurally_valid_packet_never_gets_authenticity(self):
        # Hash correctness is NOT fraud detection. Even a synthetic fully matching
        # packet has no provider attestation and receives no publishing authority.
        self.rec["id"]="forged-but-structurally-complete"
        r=self.check(); self.assertFalse(r["authenticity_independently_verified"])
        self.assertFalse(r["publish_allowed"]); self.assertFalse(r["send_allowed"])

class ActualPatchTests(unittest.TestCase):
    def setUp(self):
        self.root=Path(__file__).resolve().parents[2]
        self.base=self.root/'references/ai-vfx-creative-preproduction'
        self.j=json.loads((self.base/'commercial-offers.json').read_text())
        self.text=(self.base/'ORDER_CREATIVE_PREVIS.md').read_text()
    def test_32_actual_offers_and_consent_preserved(self):
        self.assertEqual([r['id'] for r in self.j['offers']],['director_animatic','vfx_graphic_poc','pitchvis_previs'])
        self.assertFalse(self.j['contact']['auto_send'])
        self.assertEqual(self.j['contact']['subject_marker'],'OBJ-R12-AIVIS-OFFER-2026')
    def test_33_no_unverified_numeric_quote(self):
        r=self.j['public_visual_development_reference']
        self.assertEqual(r['current_price_status'],'REVALIDATION_REQUIRED')
        self.assertIsNone(r['verified_at'])
        for k in ['start_price_ru','start_price_en','adjacent_start_price_ru','adjacent_start_price_en']:
            self.assertIsNone(r[k])
        self.assertNotIn('150 000',self.text); self.assertNotIn('$1,900',self.text)
    def test_34_no_false_assertion_that_no_price_exists(self):
        self.assertNotIn('отдельный публичный тариф на previs не указан',self.text)
        self.assertIn('не утверждает отсутствие тарифов',self.text)
    def test_35_no_gate_grants_publication_or_referral(self):
        self.assertFalse(self.j['price_evidence_policy']['automated_check_grants_publication_authority'])
        self.assertFalse(self.j['contact']['verified_search_referral'])

if __name__=='__main__': unittest.main(verbosity=2)
