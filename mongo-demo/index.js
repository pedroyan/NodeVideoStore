const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises', {useNewUrlParser: true})
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
async function createCourse() {
    //Creates the course instance
    const nodeCourse = new Course({
        name: 'C# Course',
        author: 'Pedro',
        tags: ['.NET', 'Backend'],
        isPublished: false,
        price: 50
    });

    const result = await nodeCourse.save();
    console.log('Saved new course', result._id);
}
async function getCourses() {
    const courses = await Course.find();
    console.log('Listing all courses: ', courses);
}

async function getFilteredCourses() {
    //Mongo db comparison operators:
    //eq (equal)
    //ne (not equal)
    //gt (greater than)
    //gte (greater than or equal to)
    //lt (less than)
    //lte (less than or equal to)
    //in
    //nin (not in)

    //Logical operators:
    //or
    //and

    const queried = await Course
        //.find({price: 15, author: 'Pedro'})               //I want a course with the price of 15 dollars made by Pedro
        //.find({price: {$lt: 19, $gt:6}})                  //I want courses with their prices between 19 and 6 dollars
        //.find({ price: { $in: [15, 8, 5] } })             //I want courses where their prices match any of the entered values
        .find()
        .or([{ isPublished: true }, { author: 'Pedro Yan' }])
        .and({ price: { $gt: 10 } })                            //SQL Equivalent: where (isPublished = true || author: 'Pedro') && price > 10
        .limit(10)
        .sort({ name: 1 }) //1 = Ascending order, -1 = Descending order
    //.select({ name: 1, tags: 1, price: 1 }); //Properties selected in the projection returned
    //.count(); //Get only the number of results in the query

    console.log('Queried courses', queried);
}

async function getRegexedCourses() {

    const queried = await Course
        //String starts with Pedro
        .find({ author: /^Pedro/ })
        .limit(10)
        .sort({ name: 1 }) //1 = Ascending order, -1 = Descending order
        .select({ name: 1, tags: 1 }); //Properties selected in the projection returned

    console.log('Queried courses', queried);
}

async function getPaginatedCourses() {

    const pageSize = 10;
    const pageNumber = 2;

    const queried = await Course
        //String starts with Pedro
        .find({ author: /^Pedro/ })
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize)
        .sort({ name: 1 }) //1 = Ascending order, -1 = Descending order
        .select({ name: 1, tags: 1 }); //Properties selected in the projection returned

    console.log('Queried courses', queried);
}

async function updateCourseViaQueryFirst(id){
    const course = await Course.findById(id);
    let again = await Course.find();
    if (!course) {
        console.log('No course could be found', course);
        console.log('All couses', again);
        return;
    }

    //Equivalent to the code below
    // course.isPublished = true;
    // course.author = 'Update Author';

    course.set({
        isPublished: true,
        author: 'Update Author'
    })

    const response = await course.save()
    console.log(response);
}

updateCourseViaQueryFirst('5a68fdf95db93f6477053ddd');