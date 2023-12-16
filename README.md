# `Function`
## `GitHub`
- [buildGitHubRepos](#buildGitHubRepos)
- [deleteGitHubRepos](#deletegithubrepos)
- [inviteGitHubCollaborators](#invitegithubcollaborators)
#### `buildGitHubRepos`
- `usage`
    ```
    import { buildGitHubRepos } from 'jwz';

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
### `inviteGitHubCollaborators`
- `usage`
    ```
    import { inviteGitHubCollaborators } from "jwz";

    /*
        @param org = String
        @param repo = String
        @param collaborators = array
        @param token = String
    */

    const org = 'your-org-name';
    var repo = 'your-repo-name';
    var collaborators = ['collaboratorA', 'collaboratorB']
    const token = 'your-token';

    inviteGitHubCollaborators(org, repo, collaborators, token);
    ```
- `note`
    - when code is running it will have output of result
### `deleteGitHubRepos`
- `usage`
    ```
    import { deleteGitHubRepo } from "jwz";

    /*
        @param org = String
        @param repo = array
        @param token = String
    */

    const org = 'your-org-name';
    var repos = ['your-repoA', 'your-repoB'];
    const token = 'your-token';

    deleteGitHubRepo(org, repos, token)
    ```
- `note`
    - It didn't return any (will add in future)
