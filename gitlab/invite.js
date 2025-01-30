const axios = require('axios');
const path = require('path');
const {
    readPropertiesFile,
    replacePlaceholders
} = require('../essential');

const filePath = path.join(__dirname, 'properties', 'api.properties');
const config = readPropertiesFile(filePath);

if (!config.repocollaboratorurl) {
    throw new Error(`Collaborator URL is missing in the configuration file: ${filePath}`);
}

/**
 * Invite collaborators to group repositories.
 * @param {string} groupId - The ID of the group.
 * @param {Array<string>} repoIds - Array of repository IDs.
 * @param {Array<Array<string>>} collaborators - Array of collaborator IDs per repository.
 * @param {string} token - Authentication token.
 * @returns {Promise<Array>} - Results of invitations.
 */
async function inviteToGroupRepos(groupId, repoIds, collaborators, token) {
    if (!groupId || !repoIds.length || !collaborators.length || !token) {
        throw new Error('Invalid parameters: groupId, repoIds, collaborators, and token are required.');
    }
    return inviteCollaborators(groupId, repoIds, collaborators, token);
}

/**
 * Invite collaborators to personal repositories.
 * @param {Array<string>} repoIds - Array of repository IDs.
 * @param {Array<Array<string>>} collaborators - Array of collaborator IDs per repository.
 * @param {string} token - Authentication token.
 * @returns {Promise<Array>} - Results of invitations.
 */
async function inviteToPersonalRepos(repoIds, collaborators, token) {
    if (!repoIds.length || !collaborators.length || !token) {
        throw new Error('Invalid parameters: repoIds, collaborators, and token are required.');
    }
    return inviteCollaborators(null, repoIds, collaborators, token);
}

/**
 * Helper function to invite collaborators to repositories.
 * @param {string|null} groupId - The ID of the group (null for personal repositories).
 * @param {Array<string>} repoIds - Array of repository IDs.
 * @param {Array<Array<string>>} collaborators - Array of collaborator IDs per repository.
 * @param {string} token - Authentication token.
 * @returns {Promise<Array>} - Results of invitations.
 */
async function inviteCollaborators(groupId, repoIds, collaborators, token) {
    if (repoIds.length !== collaborators.length) {
        throw new Error('Mismatch: repoIds and collaborators arrays must be of equal length.');
    }

    return Promise.all(repoIds.map(async (repoId, index) => {
        const repoResults = await Promise.all(collaborators[index].map(async (collaboratorId) => {
            if (!collaboratorId) return { collaborator: collaboratorId, success: false, error: "Invalid collaborator ID" };

            const url = replacePlaceholders(config.repocollaboratorurl, {
                project_id: repoId
            });

            try {
                const response = await axios.post(url, {
                    user_id: collaboratorId,
                    access_level: 30
                }, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
            
                return { collaborator: collaboratorId, success: true, response: response.data };
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
}

module.exports = { inviteToGroupRepos, inviteToPersonalRepos };
