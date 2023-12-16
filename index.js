const axios = require('axios');
const fs = require('fs');
const path = require('path');

////////////////
// Essential //
//////////////
function readPropertiesFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const config = {};

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && trimmedLine.includes('=')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();
        config[key.trim()] = value;
        }
    });

    return config;
}

function replacePlaceholders(url, replacements) {
    for (const placeholder in replacements) {
        const placeholderValue = replacements[placeholder];
        url = url.replace(new RegExp(`\\$\\{${placeholder}\\}`, 'g'), placeholderValue);
    }
    return url;
}

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

////////////////////////////////
// inviteGitHubCollaborators //
//////////////////////////////
/*
    @param org = String
    @param repo = String
    @param collaborators = array
    @param token = String
*/
async function inviteGitHubCollaborators(org, repo, collaborators, token) {
    // Get org repo url
    const filePath = path.join(__dirname, 'github/api.properties');
    const config = readPropertiesFile(filePath);

    try {
        // Invite collaborators
        await Promise.all(collaborators.map(async collaborator => {
            const replacements = {
                organization: org,
                repository: repo,
                collaborator: collaborator
            };

            await axios.put(replacePlaceholders(config.repourlcollaborator, replacements), {}, {
                headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                },
            });
            console.log(`Invitation sent to ${collaborator}`);
        }));

        console.log('Collaborators invited successfully.');
    } catch (error) {
        console.error('Error inviting collaborators:', error.response ? error.response.data : error.message);
    }
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

module.exports ={ 
    buildGitHubRepos,
    deleteGitHubRepos,
    inviteGitHubCollaborators
};