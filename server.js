const express = require('express');
const app = express();
const passport   = require('passport');
const session    = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

//set the path of views
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//allow json like object nested in the URL
app.use(bodyParser.urlencoded({ extended: true }));

//parse request's body to json
app.use(bodyParser.json());

//secret is used for hashing, resave to keep session active without 'touch',
// saveUL to store the session in session store
app.use(session({ secret: 'shaHuang',resave: true, saveUninitialized:true})); // session secret

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//set the environment value in .env file in root directory
const env = require('dotenv').load();

const models = require("./app/models");

const authRoute = require('./app/routes/auth.js')(app, passport);

require('./app/config/passport/passport.js')(passport, models.user);

//Sync Database
models.sequelize.sync().then(function() {

    console.log('Nice! Database looks fine')

}).catch(function(err) {

    console.log(err, "Something went wrong with the Database Update!")

});


app.get('/', (req, res) =>{
    res.send('welcome to the homepage');
});

app.listen(5000);