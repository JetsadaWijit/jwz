# Setup

## Using The Package

```sh
npm install jwz
```

Import the area you need through its subpath export:

```js
const github = require('jwz/github');
const openai = require('jwz/openai');
const sendEmail = require('jwz/mailer/outlook/send');
```

Node.js must be recent enough to support subpath `exports` in `package.json`,
which means Node.js 12 or later. The package is CommonJS, so `require` is the
supported import form.

## Working On The Package

```sh
git clone https://github.com/JetsadaWijit/jwz.git
cd jwz
npm install
```

`npm install` restores `axios` and `nodemailer` from the committed
`package-lock.json`.

There is no test runner. `npm test` is a placeholder that prints an error and
exits non zero. There is no build step either: the files under `src/` are what
gets published.

A dev container definition is provided in `.devcontainer/devcontainer.json` for
editors that support it. It configures the editor only and installs nothing.

## Credentials

Nothing is configured through environment variables. Every credential is passed
into the function that needs it:

| Area | Credential the caller must supply |
|---|---|
| `jwz/github` | A GitHub personal access token with the scopes for the operation, for example repository administration for create and delete. |
| `jwz/gitlab` | A GitLab personal access token with the equivalent project scopes. |
| `jwz/deepseek`, `jwz/openai`, `jwz/openrouter` | The provider API key. |
| `jwz/mailer/outlook/send` | The sending Outlook account address and its password or app password. |

Keep credentials out of the repository. `.gitignore` already excludes `.env` files
so that a local scratch file cannot be committed by accident.

## What Gets Published

`.npmignore` decides the contents of the npm tarball. Continuous integration
configuration, the dev container, agent instructions, and this wiki are excluded.
Only the runtime source and the package metadata ship.
