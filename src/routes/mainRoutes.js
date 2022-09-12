const express = require('express');
const mainController = require('../controllers/main');
const methodOverride = require("method-override");

const router = express.Router();

router.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));
router.get('/', mainController.home);
router.get('/books/detail/:id', mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
router.get('/users/register', mainController.register);
router.post('/users/register', mainController.processRegister);
router.get('/users/login', mainController.login);
router.post('/users/login', mainController.processLogin);
router.post('/users/login/exit', mainController.exit);
router.delete('/books/delete/:id', mainController.deleteBook);
router.get('/books/edit/:id', mainController.edit);
router.put('/books/:id/edit', mainController.processEdit);

module.exports = router;
