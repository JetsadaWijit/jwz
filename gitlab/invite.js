const axios = require('axios');
const path = require('path');
const {
    readPropertiesFile,
    replacePlaceholders
} = require('../essential');

async function inviteCollaboratorsToRepos(groupId, repoIds, collaborators, token) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.repocollaboratorurl) {
        throw new Error(`Collaborator URL is missing in the configuration file: ${filePath}`);
    }

    const results = await Promise.all(repoIds.map(async (repoId, index) => {
        const repoResults = await Promise.all(collaborators[index].map(async (collaboratorId) => {
            const url = replacePlaceholders(config.repocollaboratorurl, {
                group_id: groupId,
                project_id: repoId,
                user_id: collaboratorId,
            });

            try {
                await axios.post(url, { access_level: 30 }, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                });

                return { collaborator: collaboratorId, success: true };
            } catch (error) {
                return { 
                    collaborator: collaboratorId, 
                    success: false, 
                    error: error.response?.data || error.message 
                };
            }
        }));

        return { repoId, results: repoResults };
    }));

    return results;
}

module.exports = inviteCollaboratorsToRepos;
