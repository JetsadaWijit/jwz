////////////
// GitHub//
//////////
const buildGitHubRepos = require('./github/repository/build')
const inviteGitHubReposCollaborators = require('./github/repository/invite')
const removeGitHubReposCollaborators = require('./github/repository/remove')
const deleteGitHubRepos = require('./github/repository/delete')

module.exports ={
    /////////////
    // GitHub //
    ///////////
    buildGitHubRepos,
    deleteGitHubRepos,
    inviteGitHubReposCollaborators,
    removeGitHubReposCollaborators
};