const { sql } = require(".");
const { InternalServerError } = require("../response");

const fetchAllBooks = async (res) => {
   try {
      const result = await sql("SELECT * FROM book");
      return result;
   } catch {
      InternalServerError(res);
   }
};

const fetchCategories = async (res) => {
   try {
      const result = await sql("SELECT * FROM category");
      return result;
   } catch {
      InternalServerError(res);
   }
};

const fetchBookById = async (id, res) => {
   try {
      const result = await sql(
         `SELECT *, book.id FROM book 
           INNER JOIN category ON 
           book.category_id = category.id 
           WHERE book.id = ${id}`
      );
      return result[0];
   } catch {
      InternalServerError(res);
   }
};

const fetchBookByTitle = async ({ title, author }, res) => {
   try {
      const result = await sql(`SELECT * FROM book WHERE title = '${title}' AND author = '${author}'`);
      return result[0];
   } catch {
      InternalServerError(res);
   }
};

const InsertNewBook = async ({ categoryId, title, author, publisher, publishYear }, res) => {
   try {
      const result = await sql(
         `INSERT INTO book 
            VALUES(0, ${categoryId}, '${title}', '${author}', '${publisher}', '${publishYear}')`
      );
      return result;
   } catch {
      InternalServerError(res);
   }
};

const UpdateBook = async ({ categoryId, title, author, publisher, publishYear }, id, res) => {
   try {
      const result = await sql(
         `UPDATE book SET 
            category_id = ${categoryId}, 
            title =' ${title}', 
            author = '${author}', 
            publisher = '${publisher}', 
            publish_year = '${publishYear}' 
            WHERE id = ${id}`
      );
      return result;
   } catch {
      InternalServerError(res);
   }
};

const DeleteBook = async (id, res) => {
   try {
      const result = await sql(`DELETE FROM book WHERE id = ${id}`);
      return result;
   } catch {
      InternalServerError(res);
   }
};

// Book Loan
const InsertBookLoan = async ({ memberId, bookId, loanTime, lengthOfLoan }, res) => {
   try {
      const result = await sql(
         `INSERT INTO book_loan 
            VALUES(0, ${memberId}, ${bookId}, '${loanTime}', ${lengthOfLoan})
         `
      );

      if (result.affectedRows) {
         return await fetchBookLoanById(result.insertId, res);
      }
   } catch {
      InternalServerError(res);
   }
};

const fetchBookBorrowed = async ({ memberId, bookId }, res) => {
   try {
      const result = await sql(`SELECT * FROM book_loan WHERE member_id = ${memberId} AND book_id = ${bookId}`);
      return result[0];
   } catch {
      InternalServerError(res);
   }
};

const fetchBookLoanById = async (id, res) => {
   try {
      const result = await sql(
         `SELECT book_loan.id, title, name, age, address, loan_time, length_of_loan
         FROM book_loan INNER JOIN member ON
         book_loan.member_id = member.id INNER JOIN book ON
         book_loan.book_id = book.id
         WHERE book_loan.id = ${id}
      `
      );
      return result[0];
   } catch {
      InternalServerError(res);
   }
};

// Book Return
const InsertBookReturn = async ({ id, returnTime, charge }, res) => {
   try {
      const result = await sql(`INSERT INTO book_return VALUES(0, ${id}, '${returnTime}', ${charge})`);

      if (result.affectedRows) {
         return await fetchBookReturnById(id, res);
      }
   } catch {
      InternalServerError(res);
   }
};

const fetchBookReturnById = async (id, res) => {
   try {
      const loan = await fetchBookLoanById(id, res);
      const returned = await sql(`SELECT * FROM book_return WHERE loan_id = ${id}`);

      if (returned[0] === undefined) {
         return undefined;
      }

      return { ...loan, ...returned[0] };
   } catch {
      InternalServerError(res);
   }
};

module.exports = {
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
};
