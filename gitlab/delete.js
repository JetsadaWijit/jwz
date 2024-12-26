const axios = require('axios');
const path = require('path');
const { readPropertiesFile, replacePlaceholders } = require('./essential');

async function deleteRepos(groupId, repoIds, token) {
    const filePath = path.join(__dirname, 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config || !config.repospecificurl) {
        throw new Error("Repository-specific URL is missing in the configuration.");
    }

    try {
        const deleteRequests = repoIds.map(async (repoId) => {
            try {
                // Include both `groupId` and `project_id` in the placeholders
                const replacements = { group_id: groupId, project_id: repoId };
                const url = replacePlaceholders(config.repospecificurl, replacements);

                const response = await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                return { repoId, status: 'success', data: response.data };
            } catch (error) {
                return { repoId, status: 'failed', error: error.message };
            }
        });

        const results = await Promise.all(deleteRequests);

        const failed = results.filter((result) => result.status === 'failed');
        if (failed.length > 0) {
            console.warn('Some repositories failed to delete:', failed);
        }

        return results;
    } catch (error) {
        console.error('Error deleting GitLab repos:', error);
        throw error;
    }
}

module.exports = deleteRepos;
