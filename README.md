# `Function`
## `GitHub`
- [buildGitHubRepo](#buildGitHubRepo)
- [inviteGitHubCollaborators](#invitegithubcollaborators)
#### `buildGitHubRepo`
- `usage`
    ```
    import { buildGitHubRepo } from 'jwz';

    /*
        @param org = String
        @param repo = String
        @param vis = String
        @param token = String
    */

    const org = 'your-org-name';
    var repo = 'your-repo-name';
    const token = 'your-token';
    var vis = 'public';

    const res = await buildGitHubRepo(org, repo, vis, token);

    consoole.log(res);
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
