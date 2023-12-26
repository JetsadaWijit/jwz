![license](https://img.shields.io/badge/license-MIT-blue) ![version](https://img.shields.io/badge/version-1.6.6-blue)
<div align="center">
  <a href="https://opencollective.com/jetsadawijit" target="_blank" rel="noopener noreferrer">
    <img width="300" src="https://opencollective.com/public/images/opencollectivelogo.svg" alt="Open Collective">
  </a>
</div>

# `Function`
## `GitHub`
- [buildGitHubRepos](#buildGitHubRepos)
- [deleteGitHubRepos](#deletegithubrepos)
- [inviteGitHubReposCollaborators](#invitegithubreposcollaborators)
- [removeGitHubReposCollaborators](#removecollaboratorsfromrepos)
- [getGitHubReleaseVersion](#getgithubreleaseversion)
#### `buildGitHubRepos`
- `usage`
```
/*
    @param org = String
    @param repo = String
    @param vis = String
    @param token = String
*/
const buildGitHubRepos = require('jwz/github');

const org = 'your-org-name';
var repos = ['your-repoA', 'your-repoB'];
var vis = 'public';
const token = 'your-token';

const res = await buildGitHubRepos(org, repos, vis, token);

console.log(res);
```
### `deleteGitHubRepos`
- `usage`
```
/*
    @param org = String
    @param repos = Array
    @param token = String
*/
const deleteGitHubRepos = require('jwz/github');

const org = 'your-org-name';
var repos = ['your-repoA', 'your-repoB'];
const token = 'your-token';

deleteGitHubRepos(org, repos, token)
```
### `inviteGitHubReposCollaborators`
- `usage`
```
/*
    @param org = String
    @param repos = Array
    @param arrays = Two dimension array
    @param token = String
*/
const inviteGitHubReposCollaborators = require('jwz/github');

const org = 'your-org-name';
var repo = ['your-repoA', 'your-repoB'];
var arrays = [['collaboratorA', 'collaboratorB'], ['collaboratorC', 'collaboratorD']]
const token = 'your-token';

inviteGitHubReposCollaborators(org, repos, arrays, token);
```
- `note`
    - when code is running it will have output of result
### `removeCollaboratorsFromRepos`
- `usage`
```
/*
    @param org = String
    @param repos = Array
    @param arrays = Two dimension array
    @param token = String
*/
const removeCollaboratorsFromRepos = require('jwz/github');

const org = 'your-org-name';
var repo = ['your-repoA', 'your-repoB'];
var arrays = [['collaboratorA', 'collaboratorB'], ['collaboratorC', 'collaboratorD']]
const token = 'your-token';

removeGitHubReposCollaborators(org, repos, arrays, token);
```
### `getGitHubReleaseVersion`
- `usage`
```
/* 
    @param org = String
    @param repo = String
    @param version = String
*/
const getGitHubReleaseVersion = require('jwz/github');

const org = 'org-name';
const repo = 'repo-name';
const version = 'version'

const release = await getGitHubReleaseVersion(org, repo, version);

console.log(`Release Name: ${release.releaseName}`);
console.log(`Release Tag: ${release.releaseTag}`);
console.log(`Release URL: ${release.releaseURL}`);
```
- `note`
    - return `releaseName` `releaseTag` `releaseURL`
    - This is for public organization repository