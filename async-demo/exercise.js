(async function(){
    try{
        const customer = await getCustomer(2);
        console.log('Customer: ', customer);
        
        if (customer.isGold) {
            const movies = await getTopMovies();
            console.log('Top movies: ', movies);
            await sendEmail();
            console.log('Email sent...');
        }
    }catch(err){
        console.log(err);
    }
})()

function getCustomer(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: id,
                name: 'Mosh Hamedani',
                isGold: true,
                email: 'email'
            });
        }, 4000);
    })

}

function getTopMovies() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(['movie1', 'movie2']);
        }, 4000);
    });

}

function sendEmail(email, movies, callback) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 4000);
    });
}