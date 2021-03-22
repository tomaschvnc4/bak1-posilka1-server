const express = require('express');
const router = express.Router();
const { db, dbP } = require('../config/database');

//TODO checkJWT -- VSADEEE
router.post('/change', async (req, res) => {
   console.log('/cennik/change');
   console.log('body:', req.body);
   data = req.body.payload;

   try {
      for (let index = 0; index < data.length; index++) {
         const item = data[index];
         if (item !== null) {
            const { title, price } = item;
            let dataLength = [];
            const response = await dbP.query('SELECT id FROM cennik WHERE id=? OR title=?', [
               index,
               title,
            ]);
            console.log(`response ${index}:`, response[0]);
            dataLength = response[0].length;
            console.log('length', dataLength);

            if (dataLength === 0) {
               //INSERT
               let sql = 'INSERT INTO cennik (id,title,price) VALUES (?,?,?)';
               await dbP.query(sql, [index, title, price]);
            } else {
               //UPDATE
               let sql = 'UPDATE cennik SET title=?, price=? WHERE id=? or title=?';
               await dbP.query(sql, [title, price, index, title]);
            }
         }
      }

      console.log('SEND');
      res.status(200).send('OK');
      return;
   } catch (error) {
      console.log('CATCH:', error);
      res.status(400).send('/cennik/change no:01; FAILED');
      return;
   }
});

router.get('/get', (req, res) => {
   db.query('SELECT title,price FROM cennik', (err, result) => {
      if (err) {
         console.log('err - /cennik/get', err);
         res.status(400).send(err);
      } else {
         res.status(200).send(result);
      }
   });
});

router.delete('/deleteItem', (req, res) => {
   console.log('/cennik/deleteItem');
   console.log('body:', req.body);
   const title = req.body.payload;
   let sql = 'DELETE FROM cennik WHERE title=?';
   db.query(sql, title, (err, result) => {
      if (err) {
         console.log('err - /cennik/delete', err);
         res.status(400).send(err);
      } else {
         res.status(200).json({ result });
      }
   });
});

module.exports = router;
