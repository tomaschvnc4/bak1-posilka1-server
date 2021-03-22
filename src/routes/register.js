const express = require('express');
const router = express.Router();
const { checkJwt } = require('../Middlewares/authz/check-jwt');

const { db, dbP } = require('../config/database');

router.post('/', checkJwt, async (req, res) => {
   // router.post('/', async (req, res) => {
   console.log('user', req.user);
   console.log('body', req.body);
   let { sub: id, name: meno, email } = req.body.user;
   if (meno === email) {
      meno = '';
   }

   try {
      let sql = 'SELECT * from users where id=?';
      const response = await dbP.query(sql, id);
      const data = response[0];
      console.log('data', data);

      if (data.length === 0) {
         sql = 'INSERT INTO users (id,meno,email,telefon) VALUES (?,?,?,?)';
         const response = await dbP.query(sql, [id, meno, email, '']);
         res.status(200).send('Novy USER pridany');
         return;
      }
      res.status(200).send(data[0]);
   } catch (error) {
      console.log('CATCH /registerLogin/  :', error);
      res.status(400).send('/registerLogin/ no:01; FAILED');
   }
});

// router.get('/', checkJwt, (req, res) => {
//    const id = req.user.sub;
//    //    console.log(req.user);

//    const sql = 'SELECT id from users where id=?';
//    let stat = false;
//    db.query(sql, id, (err, result) => {
//       if (err) {
//          console.log(err);
//       } else {
//          console.log('step1:', result.length);
//          result.lenght === 0 ? (stat = false) : (stat = true);
//          console.log('statSend:', stat);
//          res.status(200).send(stat);
//       }
//    });
// });

router.get('/', checkJwt, async (req, res) => {
   const id = req.user.sub;
   console.log(req.user);

   const sql = 'SELECT id from users where id=?';
   let nonExist = true;
   try {
      const response = await dbP.query(sql, id);
      const result = response[0];
      result.length === 0 ? (nonExist = true) : (nonExist = false);
      // console.log('vysledok2:', result.length);
      // console.log('statSend:', nonExist);
      res.status(200).send(nonExist);
   } catch (error) {
      console.log('CATCH:', error);
      res.status(400);
   }
});

module.exports = router;
