const { sql } = require(".");
const { response } = require("../response");

const insertMember = async (data, res) => {
   let created = new Date().toISOString().split("T")[0];

   try {
      const { affectedRows, insertId } = await sql(
         `INSERT INTO member 
            VALUES(0, 2, '${data.fullname}', '${data.username}', '${data.password}', ${Number(data.age)}, '${data.address}', '${data.image}', '${data.gender}', '${created}', 'active')`
      );

      if (affectedRows) {
         return response(200, "Wohoo! Successfuly added new member", res, { affectedRows, insertId });
      }
   } catch (err) {
      return response(500, "Internal Server Error", res);
   }
};

const searchMember = async (username) => {
   try {
      const result = await sql(`SELECT * FROM member WHERE username='${username}'`);

      let found = result.find((data) => data.username === username);
      return found;
   } catch (err) {
      response(500, "Internal Server Error", res);
   }
};

const findMemberById = async (id) => {
   try {
      const result = await sql(`SELECT name, username, age, address, image, gender, status FROM member WHERE id=${id}`);
      return result;
   } catch (err) {
      response(500, "Internal Server Error", res);
   }
};

module.exports = { insertMember, searchMember, findMemberById };
