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

async function inviteCollaboratorsToRepos(org, repos, collaborators, token) {
    // Get org repo url
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
                    await axios.put(replacePlaceholders(config.repocollaboratorurl, replacements), {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/vnd.github.v3+json',
                        },
                    });
                    console.log(`Invitation sent to ${collaborators[i][j]} for ${repo}`);
                } catch (error) {
                    console.error(`Error inviting ${collaborators[i][j]} for ${repo}:`, error.response ? error.response.data : error.message);
                }
            }
        }));
    } catch (error) {
        console.error('Error inviting collaborators:', error.response ? error.response.data : error.message);
    }
}

module.exports = inviteCollaboratorsToRepos;