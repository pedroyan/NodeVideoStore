const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});
const Author = mongoose.model('Author', authorSchema);

//Relationship via Embedded documents prioritize performance, but ends up resulting on eventual consistency.
//Systems that opt for using this way need to embrace eventual consistency to its core
const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema]
}));

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course
    .find()
    .populate('author', 'name -_id bio')
    .select('name author');
  console.log(courses);
}

async function addAuthor(courseId, author){
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
  console.log(course);
}

async function removeAuthor(courseId, authorId){
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId)  
  author.remove();
  course.save();
  console.log(course);
}

removeAuthor('5d740fa3c6970341d8502c52', '5d740fa3c6970341d8502c4f');