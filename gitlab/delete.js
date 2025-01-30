const axios = require('axios');
const path = require('path');
const { readPropertiesFile, replacePlaceholders } = require('./essential');

/**
 * Deletes multiple repositories from GitLab.
 *
 * @param {string} groupId - The ID of the GitLab group.
 * @param {string[]} repoIds - An array of repository IDs to delete.
 * @param {string} token - The GitLab access token for authentication.
 * @returns {Promise<object[]>} - An array of objects containing the deletion status of each repository.
 */
async function deleteRepos(groupId, repoIds, token) {
    // Define the path to the API configuration file
    const filePath = path.join(__dirname, 'api.properties');
    
    // Read the API configuration file
    const config = readPropertiesFile(filePath);

    // Ensure the necessary API URL exists in the config file
    if (!config || !config.repospecificurl) {
        throw new Error("Repository-specific URL is missing in the configuration.");
    }

    try {
        // Map over the list of repo IDs and create asynchronous delete requests
        const deleteRequests = repoIds.map(async (repoId) => {
            // Define replacements for placeholders in the API URL (group_id and project_id)
            const replacements = { group_id: groupId, project_id: repoId };

            // Replace placeholders in the configured URL with actual values
            const url = replacePlaceholders(config.repospecificurl, replacements);

            // Log the repository ID and the corresponding URL being called (useful for debugging)
            console.log(`Deleting repo ${repoId} at URL: ${url}`);

            try {
                // Send a DELETE request to the GitLab API
                const response = await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Use Bearer token authentication
                        'Content-Type': 'application/json', // Specify the content type
                    },
                });

                // Return success response if the deletion is successful
                return { repoId, status: 'success', data: response.data };
            } catch (error) {
                // Return failure response with error details
                return {
                    repoId,
                    status: 'failed',
                    error: error.response?.data || error.message, // Include API response if available
                };
            }
        });

        // Execute all delete requests in parallel using Promise.all
        const results = await Promise.all(deleteRequests);

        // Filter out repositories that failed to delete
        const failed = results.filter((result) => result.status === 'failed');
        if (failed.length > 0) {
            console.warn('Some repositories failed to delete:', JSON.stringify(failed, null, 2));
        }

        // Return the results of all deletion attempts
        return results;
    } catch (error) {
        console.error('Error deleting GitLab repos:', error);
        throw error; // Rethrow the error for higher-level handling
    }
}

module.exports = deleteRepos;
