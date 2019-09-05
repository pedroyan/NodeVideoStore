console.log('Before');

//Promise-based approach
// getUser(2)
//     .then(u => getRepositories(u.gitHubUserName))
//     .then(r => getCommits(r[0]))
//     .then(c => console.log('Commits fetched', c))
//     .catch(err => console.error('An error occurred!', err));

//Async await method
async function displayCommits(){

    try{
        const user = await getUser(2);
        const repos = await getRepositories(user.gitHubUserName);
        const commits = await getCommits(repos[0]);
    
        console.log('Commits fetched', commits);
    } catch (err){
        console.log('Error', err);
    }

}

displayCommits();
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
            //reject(new Error('Unauthorized user'));
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