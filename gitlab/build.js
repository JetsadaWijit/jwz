const axios = require('axios');
const path = require('path');
const {
    readPropertiesFile,
    replacePlaceholders
} = require('../essential');

/**
 * Creates multiple GitLab repositories.
 * @param {string} group_id - The GitLab group ID.
 * @param {Array<string>} repos - List of repository names.
 * @param {string} vis - Visibility level ('public', 'private', 'internal').
 * @param {string} token - GitLab API token.
 * @returns {Promise<Array<Object>>} - List of results for each repository.
 */
async function buildRepos(group_id, repos, vis, token) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.repourl) {
        throw new Error("Repository URL is missing in the configuration.");
    }

    const retryLimit = 3;

    /**
     * Creates a GitLab repository with retries.
     * @param {string} repo - Repository name.
     * @param {number} attempt - Current retry attempt.
     * @returns {Promise<Object>} - Response object indicating success/failure.
     */
    const createGitLabRepo = async (repo, attempt = 1) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        const url = replacePlaceholders(config.repourl, { group_id });

        const data = {
            name: repo,
            visibility: vis,
        };

        try {
            const response = await axios.post(url, data, { headers });

            if (response.status === 201) {
                return { success: true, message: 'GitLab repository created successfully', repositoryName: repo, groupName: group_id };
            } else {
                return { success: false, message: `Failed to create GitLab repository`, status: response.status };
            }
        } catch (error) {
            const status = error.response?.status || 'Unknown';
            const errorMessage = error.response?.data?.message || error.message;

            console.error(`Error creating repository '${repo}' (Attempt ${attempt}/${retryLimit}):`, errorMessage);

            if (attempt < retryLimit) {
                return await createGitLabRepo(repo, attempt + 1);
            }

            return { success: false, message: 'Internal server error', status };
        }
    };

    return await Promise.all(repos.map(repo => createGitLabRepo(repo)));
}

module.exports = buildRepos;
