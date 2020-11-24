const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const port = 3000;

app.engine('handlebars', handlebars({ extname: 'hbs' }));
app.use('view engine', 'handlebars');

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

require('./routes')(app); //注意此寫法

module.exports = app;
