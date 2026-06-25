const axios = require('axios');
const path = require('path');
const {
    readPropertiesFile,
    replacePlaceholders
} = require('../essential');

/**
 * Creates multiple GitHub repositories under a specified organization.
 * 
 * @async
 * @function buildRepos
 * @param {string} org - The name of the GitHub organization.
 * @param {string[]} repos - An array of repository names to create.
 * @param {string} vis - The visibility setting for the repositories ("public" or "private").
 * @param {string} token - The GitHub personal access token for authentication.
 * @returns {Promise<Object[]>} A promise that resolves to an array of results for each repository creation.
 * @throws {Error} Throws an error if the repository URL is missing in the configuration.
 */
async function buildRepos(org, repos, vis, token) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.repourl) {
        throw new Error("Repository URL is missing in the configuration.");
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    const retryLimit = 3;

    /**
     * Creates a GitHub repository with retry logic.
     *
     * @async
     * @function createGitHubRepo
     * @param {string} repo - The name of the repository to create.
     * @param {number} [attempt=1] - The current attempt number.
     * @returns {Promise<Object>} A promise that resolves to the result of the repository creation.
     */
    const createGitHubRepo = async (repo, attempt = 1) => {
        const replacements = { organization: org };
        const data = { name: repo, visibility: vis };

        try {
            const createResponse = await axios.post(replacePlaceholders(config.repourl, replacements), data, { headers });

            if (createResponse.status === 201) {
                return { success: true, message: 'GitHub repository created successfully', repositoryName: repo, organizationName: org };
            } else {
                return { success: false, message: 'Failed to create GitHub repository', status: createResponse.status };
            }
        } catch (error) {
            if (attempt < retryLimit) {
                return createGitHubRepo(repo, attempt + 1);
            }
            console.error('Error:', error.message);
            return { success: false, message: 'Internal server error', status: error.response?.status };
        }
    };

    const results = await Promise.all(repos.map(repo => createGitHubRepo(repo)));

    return results;
}

module.exports = buildRepos;
