![license](https://img.shields.io/badge/license-MIT-blue) ![version](https://img.shields.io/badge/version-1.6.10-blue)
<div align="center">
  <a href="https://opencollective.com/jetsadawijit" target="_blank" rel="noopener noreferrer">
    <img width="300" src="https://opencollective.com/public/images/opencollectivelogo.svg" alt="Open Collective">
  </a>
</div>

# `Function`
## `GitHub`
- [buildRepos](#github-buildrepos)
- [deleteRepos](#github-deleterepos)
- [inviteCollaboratorsToRepos](#github-invitecollaboratorstorepos)
- [removeCollaboratorsFromRepos](#github-removecollaboratorsfromrepos)
- [getReleaseVersion](#github-getreleaseversion)
#### `GitHub buildRepos`
- `usage`
```
/*
    @param org = String
    @param repo = String
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
    @param arrays = Two dimension array
    @param token = String
*/
const inviteCollaboratorsToRepos = require('jwz/github/invite');

const org = 'your-org-name';
var repos = ['your-repoA', 'your-repoB'];
var arrays = [['collaboratorA', 'collaboratorB'], ['collaboratorC', 'collaboratorD']]
const token = 'your-token';

inviteCollaboratorsToRepos(org, repos, arrays, token);
```
- `note`
    - when code is running it will have output of result
### `GitHub removeCollaboratorsFromRepos`
- `usage`
```
/*
    @param org = String
    @param repos = Array
    @param arrays = Two dimension array
    @param token = String
*/
const removeCollaboratorsFromRepos = require('jwz/github/remove');

const org = 'your-org-name';
var repos = ['your-repoA', 'your-repoB'];
var arrays = [['collaboratorA', 'collaboratorB'], ['collaboratorC', 'collaboratorD']]
const token = 'your-token';

removeCollaboratorsFromRepos(org, repos, arrays, token);
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