const axios = require('axios');
const path = require('path');
const {
    readPropertiesFile,
    replacePlaceholders
} = require('../essential');

/*
    @param group_id = String
    @param repos = Array
    @param vis = String
    @param token = String
*/
async function buildRepos(group_id, repos, vis, token) {
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
    const createGitLabRepo = async (repo, attempt = 1) => {
        const replacements = { group_id };
        const data = {
            name: repo,
            visibility: vis, // 'public', 'private', or 'internal'
        };

        try {
            const createResponse = await axios.post(replacePlaceholders(config.repourl, replacements), data, { headers });

            if (createResponse.status === 201) {
                return { success: true, message: 'GitLab repository created successfully', repositoryName: repo, groupName: group_id };
            } else {
                return { success: false, message: 'Failed to create GitLab repository', status: createResponse.status };
            }
        } catch (error) {
            if (attempt < retryLimit) {
                return createGitLabRepo(repo, attempt + 1);
            }
            console.error('Error:', error.message);
            return { success: false, message: 'Internal server error', status: error.response?.status };
        }
    };

    const results = await Promise.all(repos.map(repo => createGitLabRepo(repo)));

    return results;
}

module.exports = buildRepos;
