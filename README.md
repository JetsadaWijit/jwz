# `Function`
### `GitHub`
[buildGitHubRepo](#buildGitHubRepo)
## `buildGitHubRepo`
- usage
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