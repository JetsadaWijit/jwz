const axios = require('axios');
const fs = require('fs');
const path = require('path');

/////////////
// GitHub //
///////////
//////////////////////
// buildGitHubRepo //
////////////////////
/*
    @param org = String
    @param repo = String
    @param vis = String
    @param token = String
*/
async function buildGitHubRepos(org, repos, vis, token) {
  const filePath = path.join(__dirname, 'github/api.properties');
  const config = readPropertiesFile(filePath);

  // Request headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Define a function to create a GitHub repository
  const createGitHubRepo = async (repo) => {
    const replacements = {
      organization: org
    };

    // Request body
    const data = {
      name: repo,
      visibility: vis
    };

    try {
      // Make a POST request to create the repository
      const createResponse = await axios.post(replacePlaceholders(config.repourl, replacements), data, { headers });

      // Check if the repository was created successfully
      if (createResponse.status === 201) {
        // Return relevant information, you can customize this based on your needs
        return {
          success: true,
          message: 'GitHub repository created successfully',
          repositoryName: repo,
          organizationName: org
        };
      } else {
        // Return an error message
        return {
          success: false,
          message: 'Failed to create GitHub repository',
          status: createResponse.status
        };
      }
    } catch (error) {
      // Log the error and return an error message
      console.error('Error:', error.message);
      return {
        success: false,
        message: 'Internal server error',
        status: error.response ? error.response.status : undefined
      };
    }
  };

  // Use map to create GitHub repositories in parallel
  const results = await Promise.all(repos.map(createGitHubRepo));

  return results;
}

const inviteGitHubReposCollaborators = require('./github/repository/invite')
const removeGitHubReposCollaborators = require('./github/repository/remove')
const deleteGitHubRepos = require('./github/repository/delete')

module.exports ={
    // GitHub
    buildGitHubRepos,
    deleteGitHubRepos,
    inviteGitHubReposCollaborators,
    removeGitHubReposCollaborators
};