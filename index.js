const githubRpositoryPath = './github/repository';

module.exports = {
  /////////////
  // GitHub //
  ///////////
  buildGitHubRepos: require(`${githubRpositoryPath}/build`),
  inviteGitHubReposCollaborators: require(`${githubRpositoryPath}/invite`),
  removeGitHubReposCollaborators: require(`${githubRpositoryPath}/remove`),
  deleteGitHubRepos: require(`${githubRpositoryPath}/delete`),
  getGitHubReleaseVersion: require(`${githubRpositoryPath}/release`)
};