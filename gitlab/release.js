const axios = require('axios');
const path = require('path');
const { readPropertiesFile, replacePlaceholders } = require('../essential');

/**
 * Fetches a release version from GitLab.
 * @param {string} groupId - The ID of the group (unused but kept for signature).
 * @param {string} projectId - The ID of the project.
 * @param {string} version - The tag name of the release.
 * @param {string} token - The GitLab access token.
 * @returns {Promise<Object>}
 */
async function getReleaseVersion(groupId, projectId, version, token) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.reporeleaseurl) {
        throw new Error("Release URL is missing in the configuration.");
    }

    const replacements = { group_id: groupId, project_id: projectId };

    try {
        const url = replacePlaceholders(config.reporeleaseurl, replacements);
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const release = response.data.find(r => r.tag_name === version);

        if (release) {
            return {
                success: true,
                releaseName: release.name,
                releaseTag: release.tag_name,
                releaseURL: release._links.self,
            };
        } else {
            return { success: false, message: `Release ${version} not found.` };
        }
    } catch (error) {
        console.error('Error fetching GitLab release:', error.message);
        return { success: false, message: error.message };
    }
}

module.exports = getReleaseVersion;
