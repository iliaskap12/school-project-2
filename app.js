const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public', 'html')));
app.use(express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static(path.join(__dirname, 'public', 'javascripts')));
app.use(express.static(path.join(__dirname, 'public', 'stylesheets')));
app.use(express.static(path.join(__dirname, 'public', 'fonts')));
app.use(express.static(path.join(__dirname, 'public', 'assets')));

const errorController = require(path.join(__dirname, 'controllers', 'error'));
const mongoConnect = require('./util/database').mongoConnect;
const User = require(path.join(__dirname, 'models', 'User'));

const handlebarsRouter = require(path.join(__dirname, 'routes', 'handlebars'));
const indexRouter = require(path.join(__dirname, 'routes', 'index'));
const usersRouter = require(path.join(__dirname, 'routes', 'user'));
const coursesRouter = require(path.join(__dirname, 'routes', 'courses'));
const registerRouter = require(path.join(__dirname, 'routes', 'register'));
const thanksRouter = require(path.join(__dirname, 'routes', 'thanks'));
const profileRouter = require(path.join(__dirname, 'routes', 'profile'));
const auebRouter = require(path.join(
  __dirname,
  'routes',
  'elearning-aueb-uris'
));

app.use(auebRouter);
app.use(coursesRouter);
app.use(registerRouter);
app.use(thanksRouter);
app.use(profileRouter);
app.use('/hbs', handlebarsRouter);
app.use(indexRouter);
// app.use('/users', usersRouter);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
