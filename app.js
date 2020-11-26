const express = require('express');
const handlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const port = 3000;

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(flash());

app.use((req, res, next) => {
  //產生local變數，並可以用req.flash 寫入
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

require('./routes')(app); //注意此寫法

module.exports = app;
