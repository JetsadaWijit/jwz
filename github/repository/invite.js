const axios = require('axios')
const path = require('path');

const {
    readPropertiesFile,
    replacePlaceholders
} = require('../../essential');

/*
    @param org = String
    @param repos = Array
    @param collaborators = Array
    @param token = String
*/

async function inviteCollaboratorsToRepos(org, repos, collaborators, token) {
    // Get org repo url
    const filePath = path.join(__dirname, '..', 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    try {
        // Invite collaborators for each repository
        await Promise.all(repos.map(async repo => {
            await Promise.all(collaborators.map(async collaborator => {
                const replacements = {
                    organization: org,
                    repository: repo,
                    collaborator: collaborator
                };

                try {
                    await axios.put(replacePlaceholders(config.repocollaboratorurl, replacements), {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/vnd.github.v3+json',
                        },
                    });
                    console.log(`Invitation sent to ${collaborator} for ${repo}`);
                } catch (error) {
                    console.error(`Error inviting ${collaborator} for ${repo}:`, error.response ? error.response.data : error.message);
                }
            }));
        }));

        console.log('Collaborators invited successfully.');
    } catch (error) {
        console.error('Error inviting collaborators:', error.response ? error.response.data : error.message);
    }
}

module.exports = inviteCollaboratorsToRepos;