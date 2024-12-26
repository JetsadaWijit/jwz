const axios = require('axios');
const path = require('path');
const { readPropertiesFile, replacePlaceholders } = require('../essential');

async function removeCollaboratorsFromRepos(groupId, repoIds, collaborators, token) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.repocollaboratorurl) {
        throw new Error("Collaborator URL is missing in the configuration.");
    }

    const results = await Promise.all(repoIds.map(async (repoId, i) => {
        const repoResults = [];
        for (let j = 0; j < collaborators[i].length; j++) {
            const replacements = { group_id: groupId, project_id: repoId, user_id: collaborators[i][j] };
            try {
                await axios.delete(replacePlaceholders(config.repocollaboratorurl, replacements), {
                    headers: {
                        Authorization: `Bearer ${token}`,
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

module.exports = removeCollaboratorsFromRepos;
