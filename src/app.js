const express = require('express');
const mainRouter = require('./routes/mainRoutes');
const methodOverride = require("method-override");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use('/bookDetail', mainRouter); 
app.use('/', mainRouter);
app.use(methodOverride('_method'));

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
