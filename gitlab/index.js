const buildRepos = require('./build');
const { deleteGroupRepos, deletePersonalRepos } = require('./delete');
const { inviteToGroupRepos, inviteToPersonalRepos } = require('./invite');
const getReleaseVersion = require('./release');
const { removeFromGroupRepos, removeFromPersonalRepos } = require('./remove');

module.exports = {
    buildRepos,
    deleteGroupRepos,
    deletePersonalRepos,
    inviteToGroupRepos,
    inviteToPersonalRepos,
    getReleaseVersion,
    removeFromGroupRepos,
    removeFromPersonalRepos
}
