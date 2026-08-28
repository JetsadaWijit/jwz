const path = require('path');
const { readPropertiesFile, requireHttpsUrl, resolveSecureUrl } = require('../essential');

/**
 * Runs one collaborator request per collaborator, across several repositories.
 *
 * This is shared internal machinery, not a published operation. It is deliberately
 * absent from `src/github/index.js`: the collaborator operations differ only in the
 * HTTP verb they send, so the endpoint guard, the iteration and the result shape live
 * here once and each operation supplies its own request.
 *
 * A failed request is recorded against its collaborator rather than thrown, so one
 * bad collaborator does not abandon the rest. A missing or non https endpoint is a
 * broken installation rather than a failed operation, so it rejects instead.
 *
 * @async
 * @function runCollaboratorRequests
 * @param {string} org - The organization name.
 * @param {string[]} repos - Array of repository names.
 * @param {string[][]} collaborators - A 2D array where each sub-array contains the collaborators for the corresponding repository.
 * @param {string} token - The GitHub personal access token for authentication.
 * @param {function(string, Object): Promise} send - Sends one request, given the resolved URL and the headers.
 * @returns {Promise<{ repo: string, results: { collaborator: string, success: boolean, error?: string }[] }[]>}
 *          A promise resolving to one object per repository, each carrying that repository's per collaborator results.
 * @throws {Error} If the collaborator URL is missing from the configuration, or is not https.
 */
async function runCollaboratorRequests(org, repos, collaborators, token, send) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.repocollaboratorurl) {
        throw new Error("Collaborator URL is missing in the configuration.");
    }

    requireHttpsUrl(config.repocollaboratorurl, 'repocollaboratorurl');

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
    };

    const results = await Promise.all(repos.map(async (repo, i) => {
        const repoResults = [];

        for (let j = 0; j < collaborators[i].length; j++) {
            const collaborator = collaborators[i][j];
            const replacements = { organization: org, repository: repo, collaborator };

            try {
                await send(resolveSecureUrl(config.repocollaboratorurl, replacements, 'repocollaboratorurl'), headers);

                repoResults.push({ collaborator, success: true });
            } catch (error) {
                repoResults.push({ collaborator, success: false, error: error.message });
            }
        }

        return { repo, results: repoResults };
    }));

    return results;
}

module.exports = runCollaboratorRequests;
