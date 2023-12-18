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
    const buildGitHubRepos = require('jwz');

    /*
        @param org = String
        @param repo = String
        @param vis = String
        @param token = String
    */

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
    const deleteGitHubRepos = require('jwz');

    /*
        @param org = String
        @param repos = Array
        @param token = String
    */

    const org = 'your-org-name';
    var repos = ['your-repoA', 'your-repoB'];
    const token = 'your-token';

    deleteGitHubRepos(org, repos, token)
    ```
### `inviteGitHubReposCollaborators`
- `usage`
    ```
    const inviteGitHubReposCollaborators = require('jwz');

    /*
        @param org = String
        @param repos = Array
        @param collaborators = Array
        @param token = String
    */

    const org = 'your-org-name';
    var repo = ['your-repoA', 'your-repoB'];
    var collaborators = ['collaboratorA', 'collaboratorB']
    const token = 'your-token';

    inviteGitHubReposCollaborators(org, repos, collaborators, token);
    ```
- `note`
    - when code is running it will have output of result
### `removeGitHubReposCollaborators`
- `usage`
    ```
    const removeGitHubReposCollaborators = require('jwz');

    /*
        @param org = String
        @param repos = Array
        @param collaborators = Array
        @param token = String
    */

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

    getGitHubReleaseVersion(org, repo, version);
    ```
- `note`
    - This is for public organization repository