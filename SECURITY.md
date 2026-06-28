# Security Policy

## About This Project

TNP Wood's website is a **fully static export** — HTML, CSS, and JavaScript files
served from **Vercel**. TNP (Thịnh Nguyên Phát Wooden Co., Ltd.) is an
international solid wood manufacturer, Japanese family-owned, based in Biên Hòa,
Vietnam. There is no server runtime, no database, no authentication system, and
no admin panel. The attack surface is intentionally minimal.

The contact/quote form submits to **Formspree**, a third-party static form
service. No form data touches our infrastructure.

## Supported Versions

This is a single-deployment marketing website. There are no versioned releases.
Security fixes are applied directly to the `main` branch and re-deployed.

## Scope

| Area | In scope |
|---|---|
| XSS in client-side React components | Yes |
| Sensitive data exposure (contact info, form submissions) | Yes |
| Dependency vulnerabilities (`npm audit`) | Yes |
| Misconfigured HTTP headers / `vercel.json` cache headers | Yes |
| Formspree endpoint abuse / spam | Yes (report to Formspree and to us) |
| Server-side vulnerabilities | No — there is no server |
| SQL injection | No — there is no database |
| Authentication bypass | No — there is no auth |

## Reporting a Vulnerability

If you discover a security issue, please **do not open a public GitHub issue**.

Report it privately to:

- **Email**: [jaimecanicula@gmail.com](mailto:jaimecanicula@gmail.com)
- **Subject line**: `[TNP Security] <short description>`

Include:

1. A clear description of the vulnerability
2. Steps to reproduce (URL, payload, or proof-of-concept if applicable)
3. The potential impact
4. Your name / handle (for credit, if you'd like)

## Response Timeline

| Stage | Target |
|---|---|
| Acknowledgement | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix or mitigation | Within 14 days for high/critical; best effort for low |
| Disclosure | Coordinated with reporter after fix is deployed |

## Dependency Security

Dependencies are managed via `npm`. Run `npm audit` locally to check for known
vulnerabilities. The GitHub Actions CI workflow (`deploy.yml`) runs the full
test suite on every push; a separate Dependabot configuration (if enabled)
will open PRs for dependency updates.

To audit manually:

```bash
npm audit
npm audit fix   # applies non-breaking fixes automatically
```

## Out of Scope

The following are **not** considered security vulnerabilities for this project:

- Missing security headers beyond what Vercel's static serving supports
- Rate limiting on the Formspree endpoint (report to Formspree directly)
- Clickjacking on public marketing pages with no sensitive actions
- Self-XSS or social engineering attacks requiring physical access
- Theoretical vulnerabilities with no practical exploit path

## Responsible Disclosure

We follow a coordinated disclosure model. We ask that you give us a reasonable
window to fix and deploy before publishing any findings publicly. We will credit
researchers who report valid vulnerabilities, if they wish.

Thank you for helping keep TNP's site safe.
