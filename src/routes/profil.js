const express = require('express');
const router = express.Router();
const { checkJwt } = require('../Middlewares/authz/check-jwt');

const { db, dbP } = require('../config/database');

//TODO checkJWT
// router.post('/get',checkJwt, (req, res) => {
//    console.log('user:', req.user);
//    console.log('body:', req.body);

//    const id = '11';
//    let sql = 'SELECT meno,telefon FROM users WHERE id=?';
//    db.query(sql, id, (err, result) => {
//       if (err) {
//          console.log('err - /profil/get', err);
//          res.status(400).send(err);
//       } else {
//          res.status(200).send(result);
//       }
//    });
// });

router.post('/edit', checkJwt, (req, res) => {
   console.log('user:', req.user);
   console.log('body:', req.body);

   const { id, column, value } = req.body.payload;

   let sql = `UPDATE users SET ${column}=? WHERE id=?`;
   db.query(sql, [value, id], (err, result) => {
      if (err) {
         console.log('err - /profil/edit', err);
         res.status(400).send(err);
      } else {
         res.status(200).send(result);
      }
   });
});

module.exports = router;
