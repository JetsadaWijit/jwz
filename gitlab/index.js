const { buildRepos } = require('build');
const { deleteRepos } = require('delete');
const { inviteCollaboratorsToRepos } = require('invite');
const { getReleaseVersion } = require('release');
const { removeCollaboratorsFromRepos } = require('remove');

module.exports = {
    buildRepos,
    deleteRepos,
    inviteCollaboratorsToRepos,
    getReleaseVersion,
    removeCollaboratorsFromRepos
}