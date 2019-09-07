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
  author: {
    type: authorSchema,
    required: true
  }
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

async function createCourse(name, author) {
  const course = new Course({
    name,
    author
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

async function updateAuthor(courseId, newName) {
  const course = await Course.updateOne({ _id: courseId }, {
    $set:{
      'author.name': newName
    }
  });

  //Removes the subdocument
  // const course = await Course.updateOne({ _id: courseId }, {
  //   $unset:{
  //     'author': ''
  //   }
  // });
  console.log(course);
}

//createAuthor('Mosh', 'My bio', 'My Website');

//createCourse('Node Course', new Author({ name: 'Mosh' }));

//listCourses();

updateAuthor('5d740c06d078ae77786718ec', 'Pedro Yan')