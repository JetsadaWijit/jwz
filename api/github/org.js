const axios = require('axios');

/*
    @param org = String
    @param repo = String
    @param vis = String
    @param token = String
*/
async function buildRepo(org, repo, vis, token) {
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

module.exports = buildRepo;