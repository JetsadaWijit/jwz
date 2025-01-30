const { buildRepos } = require('build');
const { deleteGroupRepos, deletePersonalRepos } = require('delete');
const { inviteToGroupRepos, inviteToPersonalRepos } = require('invite');
const { removeFromGroupRepos, removeFromPersonalRepos } = require('remove');

module.exports = {
    buildRepos,
    deleteGroupRepos, deletePersonalRepos,
    inviteToGroupRepos, inviteToPersonalRepos,
    removeFromGroupRepos, removeFromPersonalRepos
}