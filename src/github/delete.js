const axios = require('axios');
const path = require('path');
const { readPropertiesFile, replacePlaceholders } = require('../essential');

/**
 * Deletes multiple repositories from an organization.
 *
 * @param {string} org - The name of the organization.
 * @param {string[]} repos - An array of repository names to delete.
 * @param {string} token - The GitHub personal access token for authentication.
 * @returns {Promise<Array>} - A promise that resolves to an array of responses from the delete requests.
 * @throws {Error} - Throws an error if the repository-specific URL is missing in the configuration or if deletion fails.
 */
async function deleteRepos(org, repos, token) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.repospecificurl) {
        throw new Error("Repository-specific URL is missing in the configuration.");
    }

    try {
        const deleteRequests = repos.map(async repo => {
            const replacements = { organization: org, repository: repo };
            return await axios.delete(replacePlaceholders(config.repospecificurl, replacements), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        });

        return await Promise.all(deleteRequests);
    } catch (error) {
        console.error('Error deleting GitHub repos:', error);
        throw error;
    }
}

module.exports = deleteRepos;
