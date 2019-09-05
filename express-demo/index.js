const helmet = require('helmet');
const morgan = require('morgan');
const authenticator = require('./middleware/authenticator');
const hbs = require('express-handlebars');
const courses = require('./routes/courses');
const index = require('./routes/home');
const express = require('express');
const app = express();

//Watch this great tutorial if you wanna learn more about handlebars:
//https://www.youtube.com/watch?v=1srD3Mdvf50
app.engine('hbs', hbs({extname: 'hbs'}));
app.set('view engine', 'hbs');

//NOTE: The inclusion order of the middlewares matter
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); //Serves files statically
app.use(helmet());
if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan enabled...')
}
app.use(authenticator);
app.use('/api/courses', courses);
app.use('/', index);

const port = process.env.NODEPORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});