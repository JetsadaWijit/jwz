const axios = require('axios');
const path = require('path');
const { readPropertiesFile, replacePlaceholders } = require('../essential');

async function inviteCollaboratorsToRepos(groupId, repoIds, collaborators, token) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.repocollaboratorurl) {
        throw new Error("Collaborator URL is missing in the configuration.");
    }

    const results = await Promise.all(repoIds.map(async (repoId, i) => {
        const repoResults = [];
        for (let j = 0; j < collaborators[i].length; j++) {
            const replacements = {
                group_id: groupId,
                project_id: repoId,
                user_id: collaborators[i][j]
            };
            try {
                await axios.post(replacePlaceholders(config.repocollaboratorurl, replacements), {
                    access_level: 30 // Developer access level
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                repoResults.push({ collaborator: collaborators[i][j], success: true });
            } catch (error) {
                repoResults.push({ collaborator: collaborators[i][j], success: false, error: error.message });
            }
        }
        return { repoId, results: repoResults };
    }));

    return results;
}

module.exports = inviteCollaboratorsToRepos;