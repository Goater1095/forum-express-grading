const express = require('express');
const handlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('./config/passport');
const helpers = require('./_helpers');

const app = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main',
    helpers: require('./config/handlebars-helpers'),
  })
);
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use('/upload', express.static(__dirname + '/upload'));

app.use((req, res, next) => {
  //產生local變數，並可以用req.flash 寫入
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.user = helpers.getUser(req); // 取代 req.user
  next();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// 引入 routes (自動指定使用index) 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app); //注意此寫法
