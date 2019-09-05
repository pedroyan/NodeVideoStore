console.log('Before');
getUser(2, fetchUserRepositories);
console.log('After');

function getUser(id, callback){
    setTimeout(() => {
        callback({id: id, gitHubUserName: 'pedroyane'});
    }, 2000);
}

function getRepositories(username, callback){
    setTimeout(() => {
        callback(['repo1', 'repo2', 'repo3']);
    }, 2000);
}

function fetchUserRepositories(user){
    console.log('User fetched:', user);
    console.log('Fetching repos...');
    getRepositories(user, handleRepositories);
}

function handleRepositories(repositories){
    console.log('Repos fetched:', repositories);
}


