[![Npm Website](https://img.shields.io/npm/v/jwz?style=flat&logo=npm)](https://www.npmjs.com/package/jwz)

# jwz

jwz is a Node.js utility package that wraps several common APIs behind one
consistent interface, so you can automate routine work without rewriting the same
boilerplate in every project.

## Features

* **Git platforms:** build, delete, invite, release, and remove operations for
  [GitHub](https://github.com) and [GitLab](https://gitlab.com).
* **AI providers:** clients for DeepSeek, OpenAI, and OpenRouter.
* **Mailer:** sending email through Outlook.

## Quick Start

```sh
npm install jwz
```

```js
const github = require('jwz/github');
const openai = require('jwz/openai');
const sendEmail = require('jwz/mailer/outlook/send');
```

Every function takes its credential as a parameter. The package never reads an
environment variable and never stores a token.

## Documentation

This page is an overview. The full function reference, with every parameter and a
runnable example per function, lives on the project website:

**https://jetsadawijit.github.io/jwz-website/**

Every documentation page is listed in [`wiki/INDEX.md`](wiki/INDEX.md). Start
with these:

| Page | What it covers |
|---|---|
| [`wiki/information/overview.md`](wiki/information/overview.md) | What the package is and every published entry point. |
| [`wiki/information/architecture.md`](wiki/information/architecture.md) | Source layout and how a call reaches an API. |
| [`wiki/environments/setup.md`](wiki/environments/setup.md) | Installing, working locally, and the credentials each area needs. |

Agents start at [`AGENTS.md`](AGENTS.md) and route through
[`INDEX.md`](INDEX.md).

## Member

|Role|User|Email|Website|
|-|-|-|-|
|owner|[JetsadaWijit](https://github.com/JetsadaWijit)|jetsadawijit@outlook.com|[Profile](https://jetsadawijit.github.io)|

## License

MIT. See [`LICENSE`](LICENSE).
