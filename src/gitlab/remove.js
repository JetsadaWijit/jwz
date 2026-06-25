const axios = require('axios');
const path = require('path');
const { readPropertiesFile, replacePlaceholders } = require('../essential');

/**
 * Generic function to remove collaborators from repositories.
 *
 * @param {Array<string>} repoIds - List of repository IDs.
 * @param {Array<Array<string>>} collaborators - A 2D array where each index corresponds to a repository's list of collaborators (user IDs).
 * @param {string} token - The authentication token for API requests.
 * @param {Object} replacements - Additional replacements such as { group_id } for group repos.
 * @returns {Promise<Array<Object>>} - A promise resolving to an array of results containing repository ID and collaborator removal statuses.
 */
async function removeCollaborators(repoIds, collaborators, token, replacements = {}) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.repocollaboratorurlmember) {
        throw new Error("API base URL (repocollaboratorurlmember) is missing in the configuration.");
    }

    const baseUrl = config.repocollaboratorurlmember;

    if (!Array.isArray(repoIds) || !Array.isArray(collaborators) || repoIds.length !== collaborators.length) {
        throw new Error("Invalid input parameters. Ensure repoIds and collaborators are properly structured.");
    }

    const results = [];

    for (let i = 0; i < repoIds.length; i++) {
        const repoId = repoIds[i];
        const repoResults = [];

        for (const collaborator of collaborators[i]) {
            const urlReplacements = { ...replacements, project_id: repoId, user_id: collaborator };
            const requestUrl = replacePlaceholders(baseUrl, urlReplacements);

            try {
                const response = await axios.delete(requestUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                repoResults.push({
                    collaborator,
                    success: true,
                    status: response.status,
                });

            } catch (error) {
                repoResults.push({
                    collaborator,
                    success: false,
                    status: error.response?.status || 'Unknown',
                    error: error.response?.data || error.message,
                });
            }
        }

        results.push({ repoId, results: repoResults });
    }

    return results;
}

/**
 * Removes collaborators from repositories owned by a group/organization.
 * @param {string} groupId - The group ID owning the repositories.
 * @param {Array<string>} repoIds - List of repository IDs.
 * @param {Array<Array<string>>} collaborators - List of collaborators per repository.
 * @param {string} token - Authentication token.
 * @returns {Promise<Array<Object>>} - Removal results for each repository.
 */
async function removeFromGroupRepos(groupId, repoIds, collaborators, token) {
    return removeCollaborators(repoIds, collaborators, token, { group_id: groupId });
}

/**
 * Removes collaborators from personal repositories.
 * @param {Array<string>} repoIds - List of repository IDs.
 * @param {Array<Array<string>>} collaborators - List of collaborators per repository.
 * @param {string} token - Authentication token.
 * @returns {Promise<Array<Object>>} - Removal results for each repository.
 */
async function removeFromPersonalRepos(repoIds, collaborators, token) {
    return removeCollaborators(repoIds, collaborators, token);
}

module.exports = { removeFromGroupRepos, removeFromPersonalRepos };
