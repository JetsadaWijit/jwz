const axios = require('axios');
const path = require('path');
const { readPropertiesFile, replacePlaceholders } = require('../essential');

async function inviteCollaboratorsToRepos(org, repos, collaborators, token) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.repocollaboratorurl) {
        throw new Error("Collaborator URL is missing in the configuration.");
    }

    const results = await Promise.all(repos.map(async (repo, i) => {
        const repoResults = [];
        for (let j = 0; j < collaborators[i].length; j++) {
            const replacements = { organization: org, repository: repo, collaborator: collaborators[i][j] };
            try {
                await axios.put(replacePlaceholders(config.repocollaboratorurl, replacements), {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                });
                repoResults.push({ collaborator: collaborators[i][j], success: true });
            } catch (error) {
                repoResults.push({ collaborator: collaborators[i][j], success: false, error: error.message });
            }
        }
        return { repo, results: repoResults };
    }));

    return results;
}

module.exports = inviteCollaboratorsToRepos;
