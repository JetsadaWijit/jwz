const axios = require('axios');
const path = require('path');
const { readPropertiesFile, replacePlaceholders } = require('../essential');

/**
 * Fetches a specific release version from a repository.
 *
 * @param {string} org - The organization or user that owns the repository.
 * @param {string} repo - The name of the repository.
 * @param {string} version - The release tag to fetch.
 * @returns {Promise<{ success: boolean, releaseName?: string, releaseTag?: string, releaseURL?: string, message?: string }>} 
 * An object indicating success or failure, with release details if found.
 * 
 * @throws {Error} If the release URL is missing in the configuration.
 */
async function getReleaseVersion(org, repo, version) {
    const filePath = path.join(__dirname, 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    if (!config.reporeleaseurl) {
        throw new Error("Release URL is missing in the configuration.");
    }

    const replacements = { organization: org, repository: repo };

    try {
        const response = await axios.get(replacePlaceholders(config.reporeleaseurl, replacements));
        const release = response.data.find(r => r.tag_name === version);

        if (release) {
            return {
                success: true,
                releaseName: release.name,
                releaseTag: release.tag_name,
                releaseURL: release.html_url
            };
        } else {
            return {
                success: false,
                message: `Release ${version} not found.`
            };
        }
    } catch (error) {
        console.error('Error fetching GitHub release:', error.message);
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = getReleaseVersion;
