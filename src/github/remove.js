const axios = require('axios');
const runCollaboratorRequests = require('./collaborators');

/**
 * Removes collaborators from multiple repositories within an organization.
 * 
 * @param {string} org - The name of the organization.
 * @param {string[]} repos - An array of repository names.
 * @param {string[][]} collaborators - A two-dimensional array where each sub-array contains collaborators to be removed for the corresponding repository.
 * @param {string} token - The GitHub API token for authentication.
 * @returns {Promise<Object[]>} A promise resolving to an array of results, each containing the repository name and removal results.
 * 
 * @throws {Error} If the collaborator URL is missing in the configuration.
 */
async function removeCollaboratorsFromRepos(org, repos, collaborators, token) {
    return runCollaboratorRequests(org, repos, collaborators, token,
        (url, headers) => axios.delete(url, { headers }));
}

module.exports = removeCollaboratorsFromRepos;
