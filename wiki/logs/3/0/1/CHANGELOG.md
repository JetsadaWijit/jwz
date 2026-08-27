# 3.0.1

Released 2026-08-27. Makes https a checked invariant on the GitHub and GitLab
clients, so a downgraded endpoint can no longer send the caller's token in
cleartext.

## Added

* `requireHttpsUrl(url, key)` in `src/essential.js`, which throws unless an
  endpoint's protocol is `https:`, naming the properties key at fault and never
  echoing the URL or the credential.
* `resolveSecureUrl(template, replacements, key)` in `src/essential.js`, which
  substitutes placeholders and then re-checks the scheme, so the guarantee is
  attached to the URL actually sent rather than to the one written in the file.

## Changed

* All ten GitHub and GitLab operation modules now call `requireHttpsUrl` beside
  their existing key-exists guard, and build their request URL with
  `resolveSecureUrl` instead of `replacePlaceholders`.
* `wiki/information/architecture.md` and `.agents/wiki/context/repository-map.md`
  describe the guarded request flow and the properties layer's role in it.

## Security

* Closed a silent credential-downgrade path. Endpoints are read at call time from
  `properties/api.properties`, a file that ships inside the package and is editable
  in `node_modules`, and the resolved URL was handed to `axios` together with
  `Authorization: Bearer ${token}` without the scheme being checked. An endpoint
  edited to `http://` would have transmitted the token in cleartext and the request
  would still have succeeded.
* The check runs at the configuration guard, before any credential is in scope, so
  a downgrade throws rather than being absorbed by a module's retry-and-report
  path and surfacing as a generic internal error.
* No endpoint shipped in this package was ever `http://`; every one was already
  `https://`. This release removes the possibility, not an existing defect.

## Unchanged

* `replacePlaceholders` is still exported. `resolveSecureUrl` wraps it, so nothing
  that imported the old helper is broken, and no public function signature changed.
* The AI clients in `src/ai/` and the Outlook mailer are untouched. Each AI client
  calls one fixed host through the Node.js `https` module with no scheme string to
  get wrong, and the mailer uses a nodemailer service preset, so neither has a
  downgrade to guard against.
