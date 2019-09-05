console.log('Before');

getUser(2)
    .then(u => getRepositories(u.gitHubUserName))
    .then(r => getCommits(r[0]))
    .then(c => console.log('Commits fetched', c))
    .catch(err => console.error('An error occurred!', err));

console.log('After');

function getUser(id){
    return new Promise((resolve, reject) => {
        console.log('Calling github API to get user....')
        setTimeout(() => {
            resolve({id: id, gitHubUserName: 'pedroyane'});
        }, 2000);
    });
}

function getRepositories(username){
    return new Promise((resolve, reject) => {
        console.log(`Fetching repos for user ${username}`);
        setTimeout(() => {
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000);
    });
}

function getCommits(repo){
    return new Promise((resolve, reject) =>{
        console.log(`Fetching commits for repo ${repo}`)
        setTimeout(() => {
            resolve(['commit1', 'commit2']);
        }, 2000);
    })
}