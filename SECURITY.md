# Security policy — objekts Production Desk

This policy covers the public Production Desk integration published at `https://mcp.objekts.ai/mcp` and documentation in this repository. It does not imply a certification, third-party security audit, or compatibility with every MCP client.

## Reporting a vulnerability

Please report suspected security issues privately to **salute@objekts.ai** with the subject **[SECURITY] Production Desk**.

Useful information includes:
- The affected URL, endpoint, version, or repository file.
- Steps to reproduce and the expected versus observed behavior.
- The possible impact, with sensitive values redacted.
- A safe proof of concept, if available.

Please **do not post an exploitable vulnerability in a public GitHub issue**, send real client briefs, include passwords/tokens in reports, or test against another user's data. We may request clarification privately; response or remediation times are not guaranteed.

For non-security bugs, feature requests, and protocol-compatibility reports, use the public issue tracker:
https://github.com/peach420fuzz/objekts-production-desk/issues

## Scope and responsible testing

The public MCP endpoint and its documented tools are in scope for good-faith, low-impact reports. Production submissions and deletion tools affect real data: use only your own test material and do not attempt to change or delete another person's submission. Avoid disruptive scanning, denial-of-service tests, or bypass attempts against unrelated infrastructure.

The web-based Production Desk can be accessed without installing the MCP connector:
https://objekts.ai/tools/production-desk

## Compatibility and limitations

The live MCP service has documented protocol-version limitations. Check the current evidence and known issues before treating a connection failure as a security bug:
- [MCP protocol compatibility](docs/MCP_PROTOCOL_COMPATIBILITY_2026.md)
- [Issue tracker](https://github.com/peach420fuzz/objekts-production-desk/issues)

This document provides a contact and disclosure route; it is not a security rating.