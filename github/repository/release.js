const axios = require('axios')
const path = require('path');

const {
    readPropertiesFile,
    replacePlaceholders
} = require('../../essential');

/* 
    @param org = String
    @param repo = String
    @param version = String
*/

// For public organization repository

async function getReleaseVersion(org, repo, version) {
    const filePath = path.join(__dirname, '..', 'properties', 'api.properties');
    const config = readPropertiesFile(filePath);

    const replacements = {
        organization: org,
        repository: repo
    }

    try {
        // Make a GET request to the GitHub API for releases
        const response = await axios.get(replacePlaceholders(config.reporeleaseurl, replacements));
    
        // Find the release with the specified version
        const release = response.data.find((release) => release.tag_name === version);
    
        if (release) {
            // Return information about the release
            return {
                releaseName: release.name,
                releaseTag: release.tag_name,
                releaseURL: release.html_url
            };
        } else {
          console.log(`Release ${version} not found.`);
        }
      } catch (error) {
        console.error('Error fetching GitHub release:', error.message);
      }
}

module.exports = getReleaseVersion;