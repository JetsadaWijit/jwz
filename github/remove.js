const axios = require('axios');
const path = require('path');
const { readPropertiesFile, replacePlaceholders } = require('../essential');

/**
 * Removes collaborators from multiple repositories within an organization.
 * 
 * @param {string} org - The name of the organization.
 * @param {string[]} repos - An array of repository names.
 * @param {string[][]} collaborators - A two-dimensional array where each sub-array contains collaborators to be removed for the corresponding repository.
 * @param {string} token - The GitHub API token for authentication.
 * @returns {Promise<Object[]>} A promise resolving to an array of results, each containing the repository name and removal results.
 * 
 * @throws {Error} If the collaborator URL is missing in the configuration.
 */
async function removeCollaboratorsFromRepos(org, repos, collaborators, token) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.repocollaboratorurl) {
        throw new Error("Collaborator URL is missing in the configuration.");
    }

    const results = await Promise.all(repos.map(async (repo, i) => {
        const repoResults = [];
        for (let j = 0; j < collaborators[i].length; j++) {
            const replacements = { organization: org, repository: repo, collaborator: collaborators[i][j] };
            try {
                await axios.delete(replacePlaceholders(config.repocollaboratorurl, replacements), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                });
                repoResults.push({ collaborator: collaborators[i][j], success: true });
            } catch (error) {
                repoResults.push({ collaborator: collaborators[i][j], success: false, error: error.message });
            }
        }
        return { repo, results: repoResults };
    }));

    return results;
}

module.exports = removeCollaboratorsFromRepos;
