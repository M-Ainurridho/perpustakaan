const router = require("express").Router();
const { library } = require("../controllers");
const { addAndUpdateBookValidation, bookLoanValidation, bookReturnValidation } = require("../utils/validation");

router.get("/", library.getAllBooks);
router.get("/category", library.getCategories);
router.get("/:id", library.findBookById);
router.post("/create", addAndUpdateBookValidation, library.addNewBook);
router.patch("/:id", addAndUpdateBookValidation, library.updateBook);
router.delete("/:id", library.deleteBook);

// Loan
router.post("/book_loan", bookLoanValidation, library.addBookLoan);
// Return
router.post("/book_return/:id", bookReturnValidation, library.addBookReturn);

module.exports = router;
