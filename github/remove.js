const axios = require('axios')
const path = require('path');

const {
    readPropertiesFile,
    replacePlaceholders
} = require('../essential');

/*
    @param org = String
    @param repos = Array
    @param collaborators = Two dimension array
    @param token = String
*/

async function removeCollaboratorsFromRepos(org, repos, collaborators, token) {
    // Get org repo URL
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    try {
        await Promise.all(repos.map(async (repo, i) => {
            for (let j = 0; j < collaborators[i].length; j++) {
                const replacements = {
                    organization: org,
                    repository: repo,
                    collaborator: collaborators[i][j]
                };

                try {
                    await axios.delete(replacePlaceholders(config.repocollaboratorurl, replacements), {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/vnd.github.v3+json',
                        },
                    });
                    console.log(`Collaborator ${collaborators[i][j]} removed from ${repo}`);
                } catch (error) {
                    console.error(`Error removing ${collaborators[i][j]} from ${repo}:`, error.response ? error.response.data : error.message);
                }
            }
        }));
    } catch (error) {
        console.error('Error removing collaborators:', error.response ? error.response.data : error.message);
    }
}

module.exports = removeCollaboratorsFromRepos;