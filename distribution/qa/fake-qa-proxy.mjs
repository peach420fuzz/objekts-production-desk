// The public HTML injects an absolute same-site WebMCP script. In the local
// proxy its original URL becomes cross-origin and fails CORS. Route that one
// dependency through the existing upstream proxy; retain all other content.
export function rewriteQaHtml(html) {
  return html.replaceAll('src="https://fake.objekts.ai/.webmcp/bridge.js"', 'src="/.webmcp/bridge.js"');
}
