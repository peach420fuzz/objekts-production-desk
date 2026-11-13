#!/usr/bin/env python3
"""objekts FN35 addendum: exact finite-population frame sampling checks.

Standard library only. This computes idealized inclusion/detection probabilities;
it does not inspect pixels, estimate a video model's defects or approve a shot.
"""
from __future__ import annotations

import json
import sys
import unittest
from fractions import Fraction
from itertools import combinations
from math import comb


def integer(value: int, name: str, minimum: int = 0) -> int:
    if type(value) is not int or value < minimum:
        raise ValueError(f'{name} must be an integer >= {minimum}')
    return value


def probability(value: Fraction | int) -> Fraction:
    if type(value) not in (int, Fraction):
        raise ValueError('use an exact Fraction or integer probability')
    q = Fraction(value)
    if not 0 <= q <= 1:
        raise ValueError('probability must be in [0,1]')
    return q


def hit_probability(n: int, budget: int, defective: int,
                    sensitivity: Fraction | int = 1) -> Fraction:
    """Uniform distinct sample, independent of a fixed defective set.

    Sensitivity q assumes independent detection of each sampled defective frame.
    This assumption is intentionally explicit and is not measured here.
    """
    integer(n, 'n', 1)
    integer(budget, 'budget')
    integer(defective, 'defective')
    if budget > n or defective > n:
        raise ValueError('budget and defective must not exceed n')
    q = probability(sensitivity)
    denominator = comb(n, budget)
    miss = Fraction(0)
    for found in range(max(0, budget - n + defective), min(budget, defective) + 1):
        weight = Fraction(comb(defective, found) * comb(n - defective, budget - found), denominator)
        miss += weight * (1 - q) ** found
    return 1 - miss


def required_inclusion(n: int, budget: int, required: tuple[int, ...], index: int) -> Fraction:
    """Include required indices; sample the remaining budget uniformly without replacement."""
    integer(n, 'n', 1)
    integer(budget, 'budget')
    integer(index, 'index')
    if type(required) is not tuple:
        raise ValueError('required must be a tuple')
    for x in required:
        integer(x, 'required index')
    if index >= n or any(x >= n for x in required):
        raise ValueError('index out of range')
    if len(set(required)) != len(required):
        raise ValueError('duplicate required index')
    if not len(required) <= budget <= n:
        raise ValueError('required count <= budget <= n is necessary')
    return Fraction(1) if index in required else Fraction(budget - len(required), n - len(required))


def enumerate_hit(n: int, budget: int, bad: frozenset[int], q: Fraction) -> Fraction:
    """Independent small-N oracle enumerating every possible size-budget sample."""
    values = [1 - (1 - q) ** len(set(sample) & bad)
              for sample in combinations(range(n), budget)]
    return sum(values, Fraction(0)) / len(values)


class Checks(unittest.TestCase):
    enum_cases = 0

    def test_one_uniform_defect(self):
        self.assertEqual(hit_probability(250, 12, 1), Fraction(6, 125))

    def test_multi_defect_formula(self):
        self.assertEqual(hit_probability(250, 12, 5), 1 - Fraction(comb(245, 12), comb(250, 12)))

    def test_zero_defects(self):
        self.assertEqual(hit_probability(250, 12, 0), 0)

    def test_empty_budget(self):
        self.assertEqual(hit_probability(250, 0, 5), 0)

    def test_full_budget(self):
        self.assertEqual(hit_probability(250, 250, 5), 1)

    def test_all_defective(self):
        self.assertEqual(hit_probability(250, 1, 250), 1)

    def test_zero_sensitivity(self):
        self.assertEqual(hit_probability(250, 12, 5, 0), 0)

    def test_one_defect_half_sensitivity(self):
        self.assertEqual(hit_probability(250, 12, 1, Fraction(1, 2)), Fraction(3, 125))

    def test_full_budget_imperfect_detector(self):
        self.assertEqual(hit_probability(12, 12, 5, Fraction(1, 2)), Fraction(31, 32))

    def test_exact_enumeration(self):
        for n in range(1, 9):
            for b in range(n + 1):
                for k in range(n + 1):
                    for q in (Fraction(0), Fraction(1, 2), Fraction(1)):
                        self.assertEqual(hit_probability(n, b, k, q),
                                         enumerate_hit(n, b, frozenset(range(k)), q))
                        type(self).enum_cases += 1

    def test_arbitrary_fixed_defect_positions(self):
        for positions in combinations(range(8), 3):
            self.assertEqual(enumerate_hit(8, 3, frozenset(positions), Fraction(1)),
                             hit_probability(8, 3, 3))

    def test_arbitrary_one_defect_prior(self):
        # Deliberately skewed prior; the sample design is independent and uniformly random.
        prior = [Fraction(7, 10)] + [Fraction(1, 10)] * 3
        result = sum(p * enumerate_hit(4, 2, frozenset({i}), Fraction(1)) for i, p in enumerate(prior))
        self.assertEqual(result, Fraction(1, 2))

    def test_deterministic_spacing_counterexample(self):
        sample = frozenset([0, 23, 45, 68, 91, 113, 136, 158, 181, 204, 226, 249])
        self.assertNotIn(118, sample)
        self.assertIn(91, sample)
        # A fixed placement is hit or missed deterministically, not universally with 4.8% probability.
        self.assertNotEqual(Fraction(int(118 in sample)), hit_probability(250, 12, 1))

    def test_endpoint_inclusion(self):
        self.assertEqual(required_inclusion(250, 12, (0, 249), 0), 1)
        self.assertEqual(required_inclusion(250, 12, (0, 249), 249), 1)

    def test_interior_inclusion_with_required_endpoints(self):
        self.assertEqual(required_inclusion(250, 12, (0, 249), 118), Fraction(5, 124))
        self.assertNotEqual(Fraction(5, 124), Fraction(12, 250))

    def test_required_all_frames(self):
        self.assertEqual(required_inclusion(3, 3, (0, 1, 2), 1), 1)

    def test_monotonic_budget(self):
        seq = [hit_probability(25, b, 5) for b in range(26)]
        self.assertEqual(seq, sorted(seq))

    def test_invalid_dimensions(self):
        for args in [(0, 0, 0), (4, 5, 1), (4, 1, 5), (4, -1, 1), (True, 1, 1), (4.0, 1, 1)]:
            with self.assertRaises(ValueError):
                hit_probability(*args)

    def test_invalid_sensitivity(self):
        for q in (-1, 2, 0.5, float('nan'), True, '0.5'):
            with self.assertRaises(ValueError):
                hit_probability(4, 1, 1, q)

    def test_invalid_required(self):
        for args in [(4, 2, (0, 0), 1), (4, 1, (0, 3), 1), (4, 2, (0,), 4),
                     (4, 2, (False,), 1), (4, 2, [0], 1)]:
            with self.assertRaises(ValueError):
                required_inclusion(*args)


def main() -> int:
    result = unittest.TextTestRunner(stream=sys.stderr, verbosity=1).run(
        unittest.defaultTestLoader.loadTestsFromTestCase(Checks))
    report = {
        'role': '36.5', 'experiment': 'FN35-randomized-sampling-addendum-v1',
        'tests': result.testsRun, 'failures': len(result.failures), 'errors': len(result.errors),
        'exact_enumeration_parameter_cases': Checks.enum_cases,
        'defect_placement_cases': comb(8, 3),
        'N': 250, 'B': 12,
        'uniform_random_one_defect_percent': float(100 * hit_probability(250, 12, 1)),
        'uniform_random_five_defects_percent': float(100 * hit_probability(250, 12, 5)),
        'five_defects_half_sensitivity_percent': float(100 * hit_probability(250, 12, 5, Fraction(1, 2))),
        'required_endpoints_interior_percent': float(100 * required_inclusion(250, 12, (0, 249), 118)),
        'scope': 'Exact analytic probability and exhaustive small-population checks. No real video/model recall or human approval measured.',
        'assumptions': ['sample selection independent of the fixed defect set',
                        'uniform sampling without replacement for the hypergeometric formula',
                        'detector sensitivity and independent per-frame detections are hypothetical']
    }
    print(json.dumps(report, indent=2))
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    raise SystemExit(main())
