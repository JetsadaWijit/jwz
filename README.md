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
const { buildRepos } = require('jwz/github');

const org = 'your-org-name';
const repos = ['your-repoA', 'your-repoB'];
const vis = 'public';
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
const { deleteRepos } = require('jwz/github');

const org = 'your-org-name';
const repos = ['your-repoA', 'your-repoB'];
const token = 'your-token';

const res = await deleteRepos(org, repos, token);
console.log(res);
```

### `GitHub inviteCollaboratorsToRepos`

- `usage`

```
/*
    @param org = String
    @param repos = Array
    @param collaborators = Array
    @param token = String
*/
const { inviteCollaboratorsToRepos } = require('jwz/github');

const org = 'your-org-name';
const repos = ['your-repoA', 'your-repoB'];
const collaborators = ['collaboratorA', 'collaboratorB'];
const token = 'your-token';

const res = await inviteCollaboratorsToRepos(org, repos, collaborators, token);
console.log(res);
```

- `note`
    - when code is running it will have output of result

### `GitHub removeCollaboratorsFromRepos`

- `usage`

```
/*
    @param org = String
    @param repos = Array
    @param collaborators = Array
    @param token = String
*/
const { removeCollaboratorsFromRepos } = require('jwz/github');

const org = 'your-org-name';
const repos = ['your-repoA', 'your-repoB'];
const collaborators = ['collaboratorA', 'collaboratorB'];
const token = 'your-token';

const res = await removeCollaboratorsFromRepos(org, repos, collaborators, token);
console.log(res);
```

### `GitHub getReleaseVersion`

- `usage`

```
/*
    @param org = String
    @param repo = String
    @param token = String
*/
const { getReleaseVersion } = require('jwz/github');

const org = 'your-org-name';
const repo = 'your-repo-name';
const token = 'your-token';

const res = await getReleaseVersion(org, repo, token);
console.log(res);
```

- `note`
    - return `releaseName` `releaseTag` `releaseURL`
    - This is for public organization repository
# `Member`

|Role|User|Email|Website|
|-|-|-|-|
|owner|[JetsadaWijit](https://github.com/JetsadaWijit)|jetsadawijit@outlook.com|[Profile](https://jetsadawijit.github.io)|
