const {
   fetchAllBooks,
   fetchCategories,
   fetchBookById,
   fetchBookByTitle,
   InsertNewBook,
   UpdateBook,
   DeleteBook,
   InsertBookLoan,
   fetchBookBorrowed,
   fetchBookLoanById,
   InsertBookReturn,
   fetchBookReturnById,
} = require("../models/library-model");

const { SuccessResponse, NotFound, Found } = require("../response");

const getAllBooks = async (_, res) => {
   const books = await fetchAllBooks(res);
   return SuccessResponse("Successfuly get all books", books, res);
};

const getCategories = async (_, res) => {
   const categories = await fetchCategories(res);

   if (categories.length < 1) {
      return NotFound(res);
   }

   return SuccessResponse("Successfuly get categories", categories, res);
};

const findBookById = async (req, res) => {
   const { id } = req.params;
   const book = await fetchBookById(id, res);

   book?.id ? SuccessResponse("Successfuly get specific book", book, res) : NotFound(res);
};

const addNewBook = async (req, res) => {
   const data = req.body;

   const isExist = await fetchBookByTitle(data, res);
   if (isExist?.title) {
      return Found("book with this title and author already exist", res);
   }

   const { affectedRows, insertId } = await InsertNewBook(data, res);
   affectedRows && SuccessResponse("Successfuly added new book", { id: insertId, ...data }, res);
};

const updateBook = async (req, res) => {
   const { id } = req.params;

   const isExist = await fetchBookById(id, res);
   if (!isExist?.id) {
      return NotFound(res);
   }

   const { changedRows, message, affectedRows } = await UpdateBook(req.body, id, res);
   return SuccessResponse(changedRows ? "Successfuly updated book data" : "No data update", { affectedRows, changedRows, message }, res);
};

const deleteBook = async (req, res) => {
   const { id } = req.params;

   const isExist = await fetchBookById(id, res);
   if (!isExist?.id) {
      return NotFound(res);
   }

   const { affectedRows } = await DeleteBook(id, res);
   affectedRows && SuccessResponse("Successfuly deleted book data", null, res);
};

// Loan a book
const addBookLoan = async (req, res) => {
   const data = req.body;
   const isExist = await fetchBookBorrowed(data, res);

   if (isExist !== undefined) {
      return Found("this book loan already exist", res);
   }

   const insert = await InsertBookLoan(data, res);

   if (title != undefined || title) {
      const loadTimeInMilisecond = new Date(data.loanTime).getTime();
      let returnBefore = loadTimeInMilisecond + 1000 * 60 * 60 * 24 * Number(data.lengthOfLoan);

      return SuccessResponse("Successfuly managed to borrow a book", {
         msg: "Data on books borrowed",
         borrower: {
            ...insert,
            return_before: new Date(returnBefore),
            status: "is being borrowed",
         },
         res,
      });
   }
};

// Return a book
const addBookReturn = async (req, res) => {
   const { id } = req.params;
   const { returnTime } = req.body;

   const loan = await fetchBookLoanById(id, res);
   if (loan === undefined) {
      return NotFound(res);
   }

   const isReturned = await fetchBookReturnById(id, res);
   if (isReturned !== undefined) {
      return Found("this book has been returned", res);
   }

   const oneDay = 1000 * 60 * 60 * 24; // 86400000
   const expired = new Date(loan.loan_time).getTime() + 1000 * 60 * 60 * 24 * loan.length_of_loan; // 1718211430000
   let charge = new Date(returnTime).getTime() - expired;

   if (charge > 0) {
      let num = 1,
         total = 0;
      for (let i = 0; i < charge; i += oneDay) {
         total = 5000 * num;
         num++;
      }
      charge = total;
   } else {
      charge = 0;
   }

   const returned = await InsertBookReturn({ id, returnTime, charge }, res);
   return SuccessResponse("Successfuly returned a book", {
      msg: "Data on books returned",
      returner: {
         ...returned,
         status: "has been returned",
      },
      res,
   });
};

module.exports = {
   getAllBooks,
   getCategories,
   findBookById,
   addNewBook,
   updateBook,
   deleteBook,
   addBookLoan,
   addBookReturn,
};
