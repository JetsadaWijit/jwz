const axios = require('axios');

/*
    @param org = String
    @param repo = String
    @param vis = String
    @param token = String
*/
async function buildGitHubRepo(org, repo, vis, token) {
    // GitHub API endpoint to create a repository in an organization
    const createRepoUrl = `https://api.github.com/orgs/${org}/repos`;

    // Request headers
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Request body
    const data = {
        name: repo,
        visibility: vis
    };

    try {
        // Make a POST request to create the repository
        const createResponse = await axios.post(createRepoUrl, data, { headers });

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
}

/*
    @param org = String
    @param repo = String
    @param collaborators = array
    @param token = String
*/
async function inviteGitHubCollaborators(org, repo, collaborators, token) {
  try {
    // Invite collaborators
    await Promise.all(collaborators.map(async collaborator => {
      await axios.put(`https://api.github.com/repos/${org}/${repo}/collaborators/${collaborator}`, {}, {
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

module.exports ={ 
    buildGitHubRepo,
    inviteGitHubCollaborators
};