const axios = require('axios');
const runCollaboratorRequests = require('./collaborators');

/**
 * Invites collaborators to multiple repositories in a given organization.
 *
 * @param {string} org - The organization name.
 * @param {string[]} repos - Array of repository names.
 * @param {string[][]} collaborators - A 2D array where each sub-array contains collaborators for the corresponding repository.
 * @param {string} token - The GitHub personal access token for authentication.
 * @returns {Promise<{ repo: string, results: { collaborator: string, success: boolean, error?: string }[] }[]>} 
 *          A promise resolving to an array of objects containing repository names and the results of collaborator invitations.
 * @throws {Error} If the collaborator URL is missing from the configuration.
 */
async function inviteCollaboratorsToRepos(org, repos, collaborators, token) {
    return runCollaboratorRequests(org, repos, collaborators, token,
        (url, headers) => axios.put(url, {}, { headers }));
}

module.exports = inviteCollaboratorsToRepos;
