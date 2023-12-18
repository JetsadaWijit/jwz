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

///////////////////////
// deleteGitHubRepo //
/////////////////////
async function deleteGitHubRepos(org, repos, token) {
  try {
      // Get org repo URL
      const filePath = path.join(__dirname, 'github/api.properties');
      const config = readPropertiesFile(filePath);

      const deleteRequests = repos.map(async repo => {
          const replacements = {
              organization: org,
              repository: repo
          };
          return await axios.delete(replacePlaceholders(config.repospecificurl, replacements), {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          });
      });

      return await Promise.all(deleteRequests);
  } catch (error) {
      // Handle error if needed
      console.error('Error deleting GitHub repos:', error);
      throw error; // Re-throw the error if needed
  }
}

/////////////////////////////////////
// removeGitHubReposCollaborators //
///////////////////////////////////
/*
    @param org = String
    @param repos = Array
    @param collaborators = Array
    @param token = String
*/
async function removeGitHubReposCollaborators(org, repos, collaborators, token) {
  // Get org repo url
  const filePath = path.join(__dirname, 'github/api.properties');
  const config = readPropertiesFile(filePath);

  try {
      // Remove collaborators for each repository
      await Promise.all(repos.map(async repo => {
          await Promise.all(collaborators.map(async collaborator => {
              const replacements = {
                  organization: org,
                  repository: repo,
                  collaborator: collaborator
              };

              try {
                  await axios.delete(replacePlaceholders(config.repourlcollaborator, replacements), {
                      headers: {
                          Authorization: `Bearer ${token}`,
                          Accept: 'application/vnd.github.v3+json',
                      },
                  });
                  console.log(`Collaborator ${collaborator} removed from ${repo}`);
              } catch (error) {
                  console.error(`Error removing ${collaborator} from ${repo}:`, error.response ? error.response.data : error.message);
              }
          }));
      }));

      console.log('Collaborators removed successfully.');
  } catch (error) {
      console.error('Error removing collaborators:', error.response ? error.response.data : error.message);
  }
}

const inviteGitHubReposCollaborators = require('./github/repository/invite')

module.exports ={
    // GitHub
    buildGitHubRepos,
    deleteGitHubRepos,
    inviteGitHubReposCollaborators,
    removeGitHubReposCollaborators
};