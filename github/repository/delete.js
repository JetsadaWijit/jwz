const axios = require('axios')
const path = require('path');

const {
    readPropertiesFile,
    replacePlaceholders
} = require('../../essential');

/*
    @param org = String
    @param repos = Array
    @param token = String
*/

async function deleteGitHubRepos(org, repos, token) {
    try {
        // Get org repo URL
        const filePath = path.join(__dirname, '..', 'properties', 'api.properties');
        const config = readPropertiesFile(filePath);

        const deleteRequests = repos.map(async repo => {
            const replacements = {
                organization: org,
                repository: repo
            };
            return await axios.delete(replacePlaceholders(config.repospecificurl, replacements), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        });

        return await Promise.all(deleteRequests);
    } catch (error) {
        // Handle error if needed
        console.error('Error deleting GitHub repos:', error);
        throw error; // Re-throw the error if needed
    }
}

module.exports = deleteGitHubRepos;