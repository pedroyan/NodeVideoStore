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

/**Embedding documents (denormalization) solves this issue. We can read a complete
 * representation of a document with a single query. All the necessary data is
 * embedded in one document and its children. But this also means we’ll have multiple
 * copies of data in different places. While storage is not an issue these days,
 * having multiple copies means changes made to the original document may not propagate
 * to all copies. If the database server dies during an update, some documents will be
 * inconsistent. For every business, for every problem, you need to ask this question:
 * “can we tolerate data being inconsistent for a short period of time?” If not, you’ll
 * have to use references. But again, this means that your queries will be slower. 
 */
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