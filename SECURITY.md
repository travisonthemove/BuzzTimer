# Security

BuzzTimer is an experimental static application, not a secure store for sensitive health or personal information. The current main branch is the maintenance target; there is no long-term support or guaranteed response time.

## Reporting a concern

Use the existing creator contact on the app's [Contact page](https://travisonthemove.github.io/BuzzTimer/contact.html) for suspected vulnerabilities. Do not post passwords, browser session exports, personal journal entries, or sensitive reproduction data in public issues. Describe the affected version, browser, behavior, and a minimal reproduction using invented data. No new reporting address is established here.

## Security boundaries

- Browser local storage is not encrypted by the app and is scoped to the origin, not the `/BuzzTimer/` path. Do not host unrelated untrusted scripts on that origin.
- User-supplied journal and history content is rendered as text. Do not add HTML rendering or import features without a separate security review.
- A Content Security Policy restricts scripts to this origin and blocks script network requests, object embedding, and form submission. Inline styles remain allowed for the current UI and tooltip library. Google Fonts remains an allowed external font/style source.
- The local preview serves public assets only, binds to loopback, and does not send permissive CORS headers. It is a development server, not a production service.
- New tabs use opener/referrer protections. Sharing and external navigation are explicit user actions and can disclose the selected text.
- Exported history files are readable JSON. Keep them out of Git and shared folders unless sharing is intentional.

## Maintenance

Run the tests and dependency advisory check before release. Keep dependency versions and vendored runtime assets synchronized, retain license notices, and review dependency-update pull requests before merging. Do not paste credential values into issues, documentation, or test fixtures.

Removing tracked development files does not erase Git history. If an active credential is ever discovered, revoke or rotate it first through the relevant service, then assess history cleanup and dependent deployments separately. This repository cleanup does not claim that all historical objects are free of sensitive information.
