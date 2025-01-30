const axios = require('axios');
const path = require('path');
const {
    readPropertiesFile,
    replacePlaceholders
} = require('../essential');

/**
 * Deletes multiple repositories from a GitLab group.
 *
 * @param {string} groupId - The ID of the GitLab group.
 * @param {string[]} repoIds - An array of repository IDs to delete.
 * @param {string} token - The GitLab access token for authentication.
 * @returns {Promise<object[]>} - An array of objects containing the deletion status of each repository.
 */
async function deleteGroupRepos(groupId, repoIds, token) {
    return deleteRepos(repoIds, token, { group_id: groupId });
}

/**
 * Deletes multiple personal repositories from GitLab.
 *
 * @param {string[]} repoIds - An array of repository IDs to delete.
 * @param {string} token - The GitLab access token for authentication.
 * @returns {Promise<object[]>} - An array of objects containing the deletion status of each repository.
 */
async function deletePersonalRepos(repoIds, token) {
    return deleteRepos(repoIds, token);
}

/**
 * Deletes repositories from GitLab.
 *
 * @param {string[]} repoIds - An array of repository IDs to delete.
 * @param {string} token - The GitLab access token for authentication.
 * @param {object} replacements - Placeholder replacements for API URLs.
 * @returns {Promise<object[]>} - An array of objects containing the deletion status of each repository.
 */
async function deleteRepos(repoIds, token, replacements = {}) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config || !config.repospecificurl) {
        throw new Error("Repository-specific URL is missing in the configuration.");
    }

    try {
        const deleteRequests = repoIds.map(async (repoId) => {
            const updatedReplacements = { ...replacements, project_id: repoId };
            const url = replacePlaceholders(config.repospecificurl, updatedReplacements);

            console.log(`Deleting repo ${repoId} at URL: ${url}`);

            try {
                const response = await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                return { repoId, status: 'success', data: response.data };
            } catch (error) {
                return {
                    repoId,
                    status: 'failed',
                    error: error.response?.data || error.message,
                };
            }
        });

        const results = await Promise.all(deleteRequests);

        const failed = results.filter((result) => result.status === 'failed');
        if (failed.length > 0) {
            console.warn('Some repositories failed to delete:', JSON.stringify(failed, null, 2));
        }

        return results;
    } catch (error) {
        console.error('Error deleting GitLab repos:', error);
        throw error;
    }
}

module.exports = { deleteGroupRepos, deletePersonalRepos };
