# Architecture

`jwz` is a flat CommonJS package. There is no framework, no build step, and no
runtime state. Each published function is a standalone async call to one HTTP API.

## Source Tree

```
src/
  index.js              package main, a placeholder
  essential.js          shared helpers
  ai/
    deepseek.js
    openai.js
    openrouter.js
  github/
    index.js            re-export surface for jwz/github
    build.js delete.js invite.js release.js remove.js
    collaborators.js    shared by invite.js and remove.js, not published
    properties/api.properties
  gitlab/
    index.js            re-export surface for jwz/gitlab
    build.js delete.js invite.js release.js remove.js
    properties/api.properties
  mailer/
    outlook/
      index.js          re-export surface for jwz/mailer/outlook/send
      send.js
```

One file holds one operation. The folder `index.js` composes those files into the
object that the `exports` map in `package.json` points at. `src/index.js` is the
declared `main` but is currently empty, because consumers reach the package
through subpath imports rather than the root.

`src/github/collaborators.js` is the one file that is not an operation. Inviting a
collaborator and removing one differ only in the HTTP verb they send, so the endpoint
guard, the iteration over repositories and collaborators, and the per collaborator
result shape live there once, and `invite.js` and `remove.js` each supply their own
request. It is not listed in `index.js` and is not part of the published surface.

## How A Git Platform Call Works

1. The caller imports the platform surface, for example
   `const github = require('jwz/github');`, and calls a function with its own
   token.
2. The function loads `properties/api.properties` from its own folder using
   `readPropertiesFile` from `src/essential.js`.
3. It checks that the key it needs exists, and throws a plain error if it is
   missing.
4. It checks that the endpoint uses https with `requireHttpsUrl`, and throws
   before any credential is used if it does not.
5. It fills the `${placeholder}` segments of the URL template with
   `resolveSecureUrl`, using caller supplied values such as the organization,
   repository, or project id. That helper substitutes and then re-checks the
   scheme, so the URL handed to `axios` is verified rather than assumed.
6. It calls the API with `axios`, sending the token in an `Authorization` header.
7. On a transient failure it retries, up to a local limit of three attempts.
8. It resolves with a plain object rather than throwing:
   `{ success: true, message, ... }` or `{ success: false, message, status }`.
   Functions that take an array of entities run the calls with `Promise.all` and
   resolve with an array of these objects.

## The Properties Layer

Endpoints are configuration, not code. `src/github/properties/api.properties` and
`src/gitlab/properties/api.properties` hold one commented `key=value` line per
endpoint, with `${placeholder}` segments for the parts that vary:

```
# get repo collaborator
repocollaboratorurl=https://api.github.com/repos/${organization}/${repository}/collaborators/${collaborator}
```

`readPropertiesFile` parses the file into a flat object, splitting on the first
`=` so a value may itself contain `=`. `replacePlaceholders` substitutes every
occurrence of each named placeholder. Keeping URLs here means an API path change
is a one line edit in a data file.

Because these endpoints are configuration rather than code, they are also the one
place a secure transport could be lost. Every request this package makes carries
the caller's token, so an endpoint edited down to `http://` would send that token
in cleartext. `requireHttpsUrl` rejects a non-https endpoint, and
`resolveSecureUrl` re-checks the scheme after substitution, so the guarantee holds
for the URL actually sent rather than the one written in the file. Both throw; a
downgraded endpoint fails loudly instead of degrading quietly.

## The AI Clients

The three AI clients do not use the properties layer. Each targets one fixed host
and one fixed path, and calls it through the Node.js `https` module rather than
`axios`, collecting the response body and resolving with the parsed JSON. Each
exposes the same three functions:

* `askAi(model, token, systemPrompt, message)` resolves with the raw provider
  response.
* `getCompletion(json)` returns the answer text, or an empty string if the shape
  is not what was expected.
* `getTokenUsage(json)` returns the total token count, or `0`.

The extractors never throw on a missing field. That keeps a provider side response
change from crashing a caller.

## The Mailer

`sendEmail(sender, password, receiver, subject, text)` builds a `nodemailer`
transport for the `Outlook365` service on each call and resolves with the
`nodemailer` info object. It is the one place in the package that rethrows rather
than returning a result object.

The transport sets `requireTLS: true`, and that is not decoration. The `Outlook365`
preset resolves to port 587 with `secure: false`, so the connection opens in cleartext
and is upgraded by STARTTLS afterwards. Left to its default, `nodemailer` attempts
that upgrade only when the server advertises STARTTLS, which means a server that
simply omits it receives the sender's password in the clear. `requireTLS` makes the
upgrade mandatory: if it cannot be completed the call rejects and no credential is
sent. `opportunisticTLS` and `ignoreTLS` both undo this and must stay unset.

Port 465 with `secure: true` is not an alternative here. Microsoft 365 accepts SMTP
authentication only on port 587 with STARTTLS.

## Dependencies

`axios` for the Git platform HTTP calls and `nodemailer` for mail. Everything else
comes from the Node.js standard library: `https`, `fs`, and `path`.
