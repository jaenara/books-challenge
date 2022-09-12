const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
let categoryUser = null;
let sheckLogin = false;

const mainController = {
  home: (req, res) => {
    let LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
    if (localStorage.getItem('state')) {
      categoryUser = JSON.parse(localStorage.getItem('state')).category
      sheckLogin = JSON.parse(localStorage.getItem('state')).islogged
    }
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
    .then((books) => {
      res.render('home', { books : books , logged : sheckLogin});
    })
    .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {    
    // Implement look for details in the database
    let idParams = req.params.id
    db.Book.findAll({
      include: [{ association: 'authors' }],
      where: {
        id: idParams
      }
    })
    .then((bookSelect) => {
      res.render('bookDetail',{bookSelect: bookSelect, admin: categoryUser == 1 ? true : false, logged : sheckLogin});//fn cod
    })
    .catch((error) => console.log(error));
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [], logged : sheckLogin });
  },
  bookSearchResult: (req, res) => {
    // Implement search by title
    db.Book.findAll({
      include: [{ association: 'authors' }],
      where: {
        title: {
          [Op.like]: '%'+req.body.title+'%'
        }
      }
    })
    .then((books) => {
      res.render('search',{books: books, logged : sheckLogin});
    })
    .catch((error) => console.log(error));
  },
  deleteBook: (req, res) => {
    // Implement delete book
    db.Book.destroy({
      include: [{ association: 'authors'}],
      where: {
        '$authors.BooksAuthors.AuthorId$': '$authors.BooksAuthors.BookId$',
        id: req.params.id
      }
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => console.log(error));
  },
  authors: (req, res) => {
    db.Author.findAll()
    .then((authors) => {
      res.render('authors', { authors : authors, logged : sheckLogin});
    })
    .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    // Implement books by author
    let idParams = req.params.id
    db.Book.findAll({
      include: [{ association: 'authors'}],
      where: {
        '$authors.BooksAuthors.AuthorId$': idParams
      },
    })
    .then((authorBooks) => {
      res.render('authorBooks', {authorBooks: authorBooks, logged : sheckLogin});
    })
    .catch((error) => console.log(error));
  },
  register: (req, res) => {
    res.render('register',{logged : sheckLogin});
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process
    res.render('login', { error: ''});
  },
  exit: (req, res) => {
    // Implement login process
    if (typeof localStorage === "undefined" || localStorage === null) {
      let LocalStorage = require('node-localstorage').LocalStorage;
      localStorage = new LocalStorage('./storage');
      localStorage.removeItem('state');
    } 
    res.render('login', { error: ''});
  },
  processLogin: (req, res) => {
    // Implement login process
    db.User.findAll({
      where: {
        Email: req.body.email
      }
    })
    .then((prueba) => {
      if (prueba.length) {
        bcryptjs.compare(req.body.password,prueba[0].Pass, function(err, isMatch) {
          if (err) {
            throw err
          } else if (!isMatch) {
            res.render('login', { error: 'Error de credenciales'});
          } else {
            if (typeof localStorage === "undefined" || localStorage === null) {
              var LocalStorage = require('node-localstorage').LocalStorage;
              localStorage = new LocalStorage('./storage');
            }
            localStorage.setItem('state',JSON.stringify({islogged: true, category: prueba[0].CategoryId}));
            res.redirect('/');
          }
        });
      }
    })
    .catch((error) => console.log(error));
  },
  edit: (req, res) => {
    // Implement edit book
    db.Book.findAll({
      where: {
        id: req.params.id
      },
    })
    .then((editBook) => {
      res.render('editBook', {id: req.params.id, title: editBook[0].title, cover: editBook[0].cover, description: editBook[0].description, logged : sheckLogin});
    })
    .catch((error) => console.log(error));
  },
  processEdit: (req, res) => {
    // Implement edit book
    db.Book.update(
      {
        title: req.body.title,
        cover: req.body.cover,
        description: req.body.description,
      },
      {
        where: { id: req.params.id},
      }
    )
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => console.log(error));
  }
};

module.exports = mainController;
