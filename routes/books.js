var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

/*  Main page, shows all books  */

router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll({});
    res.render("index", { books});
}));

// /* Create a new book. */
router.get('/new-book', (req, res) => {
    res.render("new-book", { book: {}, title: "New book" });
  });


// /* POST create BOOK. */ 
router.post('/new-book', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect("/");
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", { book, errors: error.errors, title: "New book" })
      } else {
        throw error;
      }  
    }
  }));


// /* GET update book */ 
router.get("/:id", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
      res.render("update-book", { book, title: book.title });  
    } else {
      // res.sendStatus(404);

      const err = new Error();
      err.status= 404;
      err.message = `Looks like this book doesn't exist.`
      next(err);
    }
  })); 

// /* POST Update book. */
router.post('/:id/', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
      if(book) {
        await book.update(req.body);
        res.redirect("/"); 
      } else {
        res.sendStatus(404);
        
      }
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", { book, errors: error.errors, title: "Update Book" })
      } else {
        throw error;
      }
    }
}));

// /*  GET delete book  */
router.get('/:id/delete', asyncHandler(async(req,res, next)=>{
    const book = await Book.findByPk(req.params.id);
    if(book){
        res.render('delete', {book:book, title:"Delete book"})
    } else {
        res.sendStatus(404);
    }
}))

// /*  POST delete book  */
router.post('/:id/delete', asyncHandler(async(req,res, next)=>{
    const book = await Book.findByPk(req.params.id);
    if(book){
        await book.destroy();
        res.redirect('/');
    } else {
        res.sendStatus(404);
    }
}))

module.exports = router;