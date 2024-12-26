const axios = require('axios');
const path = require('path');
const { readPropertiesFile, replacePlaceholders } = require('../essential');

async function getReleaseVersion(groupId, projectId, version) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.reporeleaseurl) {
        throw new Error("Release URL is missing in the configuration.");
    }

    const replacements = { group_id: groupId, project_id: projectId };

    try {
        const url = replacePlaceholders(config.reporeleaseurl, replacements);
        const response = await axios.get(url);

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
