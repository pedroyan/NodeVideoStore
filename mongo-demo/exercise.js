const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
    .then(() => console.log('Connected to MongoDb...'))
    .catch(err => console.log('Could not connect to MongoDB', err));

//Defines the course schema
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: Number,
});

//Creates the Course class
const Course = mongoose.model('Course', courseSchema);

Exercise2()
    .then(r => console.log(r))
    .catch(err => console.log('Error occurred', err));

async function Exercise1() {
    //Get all published backend courses,
    //sort them by their name,
    //pick only their name and author
    //and display them

    return await Course
        .find({ tags: 'backend' })
        .sort({ name: 1 })
        .select({ name: 1, author: 1 });
}

async function Exercise2() {
    //Get all published frontend and backend courses,
    //sort them by their price in a descending order,
    //pick only their name and author and display them

    //My solution using OR
    // return await Course
    //     .find({isPublished: true})
    //     .or([{tags: 'backend'}, {tags: 'frontend'}])
    //     .sort({ price: -1 })
    //     .select({ name: 1, author: 1 });

    //Cleaner soluton using in and string syntax
    return await Course
        .find({isPublished:true, tags: { $in: ['frontend', 'backend'] }})
        .sort('-price')
        .select('name author price');
}

