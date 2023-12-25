![license](https://img.shields.io/badge/license-MIT-blue)
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
- [removeGitHubReposCollaborators](#removegithubreposcollaborators)
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
const buildGitHubRepos = require('jwz');

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
const deleteGitHubRepos = require('jwz');

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
    @param collaborators = Array of Array
    @param token = String
*/
const inviteGitHubReposCollaborators = require('jwz');

const org = 'your-org-name';
var repo = ['your-repoA', 'your-repoB'];
var arrays = [['collaboratorA', 'collaboratorB'], ['collaboratorC', 'collaboratorD']]
const token = 'your-token';

inviteGitHubReposCollaborators(org, repos, arrays, token);
```
- `note`
    - when code is running it will have output of result
### `removeGitHubReposCollaborators`
- `usage`
```
/*
    @param org = String
    @param repos = Array
    @param collaborators = Array
    @param token = String
*/
const removeGitHubReposCollaborators = require('jwz');

const org = 'your-org-name';
var repo = ['your-repoA', 'your-repoB'];
var collaborators = ['collaboratorA', 'collaboratorB']
const token = 'your-token';

removeGitHubReposCollaborators(org, repos, collaborators, token);
```
### `getGitHubReleaseVersion`
- `usage`
```
/* 
    @param org = String
    @param repo = String
    @param version = String
*/
const getGitHubReleaseVersion = require('jwz');

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