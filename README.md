<h3 align="center">

`JetsadaWijit`

[![repository](https://img.shields.io/badge/repository-white)](https://github.com/jetsadawijit/npmjs)
[![website](https://img.shields.io/badge/website-white)](https://jetsadawijit.github.io/npmjs-website)
[![mail](https://img.shields.io/badge/mail-white)](mailto:jetsadawijit@outlook.com)
[![Donation](https://img.shields.io/badge/donation-white)](https://jetsadawijit.github.io/donation)

</h3>

![license](https://img.shields.io/badge/license-MIT-blue) ![version](https://img.shields.io/badge/version-1.7.3-blue)

# `Function`

## `Mailer`

### `outlook`

- [send](#mailer-outlook-send)

## `GitHub`

- [buildRepos](#github-buildrepos)
- [deleteRepos](#github-deleterepos)
- [inviteCollaboratorsToRepos](#github-invitecollaboratorstorepos)
- [removeCollaboratorsFromRepos](#github-removecollaboratorsfromrepos)
- [getReleaseVersion](#github-getreleaseversion)

### `mailer-outlook-send`

- `usage`

```
/*
    Sends an email using the jwz/mailer/outlook/send library.

    @param {string} sender The email address of the sender.
    @param {string} password The password for the sender's email account.
    @param {string} receiver The email address of the recipient.
    @param {string} subject The subject line of the email.
    @param {string} text The body text of the email.
*/
const sendEmail = require('jwz/mailer/outlook/send');

const sender = 'sender@outlook.com';
const password = '1234'; // Please note: storing password in plain text is insecure.

const receiver = 'receiver@outlook.com';

const subject = 'Test';
const text = 'This is a test email.'; // Added some content to the body

sendEmail(sender, password, receiver, subject, text);
```

- note
    - Using environment variables for passwords is more secure.

#### `GitHub buildRepos`

- `usage`

```
/*
    @param org = String
    @param repos = Array
    @param vis = String
    @param token = String
*/
const buildRepos = require('jwz/github/build');

const org = 'your-org-name';
var repos = ['your-repoA', 'your-repoB'];
var vis = 'public';
const token = 'your-token';

const res = await buildRepos(org, repos, vis, token);

console.log(res);
```

### `GitHub deleteRepos`

- `usage`

```
/*
    @param org = String
    @param repos = Array
    @param token = String
*/
const deleteRepos = require('jwz/github/delete');

const org = 'your-org-name';
var repos = ['your-repoA', 'your-repoB'];
const token = 'your-token';

deleteRepos(org, repos, token)
```

### `GitHub inviteCollaboratorsToRepos`

- `usage`

```
/*
    @param org = String
    @param repos = Array
    @param collaborators = Two dimension array
    @param token = String
*/
const inviteCollaboratorsToRepos = require('jwz/github/invite');

const org = 'your-org-name';
var repos = ['your-repoA', 'your-repoB'];
var collaborators = [['collaboratorA', 'collaboratorB'], ['collaboratorC', 'collaboratorD']]
const token = 'your-token';

inviteCollaboratorsToRepos(org, repos, collaborators, token);
```

- `note`
    - when code is running it will have output of result

### `GitHub removeCollaboratorsFromRepos`

- `usage`

```
/*
    @param org = String
    @param repos = Array
    @param collaborators = Two dimension array
    @param token = String
*/
const removeCollaboratorsFromRepos = require('jwz/github/remove');

const org = 'your-org-name';
var repos = ['your-repoA', 'your-repoB'];
var collaborators = [['collaboratorA', 'collaboratorB'], ['collaboratorC', 'collaboratorD']]
const token = 'your-token';

removeCollaboratorsFromRepos(org, repos, collaborators, token);
```

### `GitHub getReleaseVersion`

- `usage`

```
/* 
    @param org = String
    @param repo = String
    @param version = String
*/
const getReleaseVersion = require('jwz/github/release');

const org = 'org-name';
const repo = 'repo-name';
const version = 'version'

const release = await getReleaseVersion(org, repo, version);

console.log(`Release Name: ${release.releaseName}`);
console.log(`Release Tag: ${release.releaseTag}`);
console.log(`Release URL: ${release.releaseURL}`);
```

- `note`
    - return `releaseName` `releaseTag` `releaseURL`
    - This is for public organization repository
# `Member`

|Status|GitHub|GitLab|Email|
|-|-|-|-|
|owner|[JetsadaWijit](https://github.com/JetsadaWijit)|[JetsadaWijit](https://gitlab.com/JetsadaWijit)|jetsadawijit@outlook.com|
