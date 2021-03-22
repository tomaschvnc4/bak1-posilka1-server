const express = require('express');
const router = express.Router();
const moment = require('moment');
const { checkJwt } = require('../Middlewares/authz/check-jwt');

const { db, dbP } = require('../config/database');

router.post('/add', checkJwt, async (req, res) => {
   console.log('user:', req.user);
   console.log('body:', req.body);
   /*LOG:
   body: {
      payload: {
         'auth0|6022597a256c640069801f2c': { '1614812400000': [Object], '1614898800000': [Object] }
      }
   }
   */
   const { sub: userId } = req.user;
   const newRezervacie = req.body.payload[userId];
   console.log('rezervacie:', newRezervacie);
   /*LOG:
   {
      '1614812400000': { minI: 2, maxI: 3 },
      '1614898800000': { minI: 1, maxI: 2 }
   }
   */
   const timeStampKeys = Object.keys(newRezervacie);
   console.log(timeStampKeys);
   let sql = 'SELECT tstampOfDay FROM rezervacie WHERE userId=?';
   let rowsData = [];
   try {
      const response = await dbP.query(sql, [userId]);
      console.log('response:', response[0]);
      // if (response[0][0].count !== 0) existuje = true;
      rowsData = response[0];
   } catch (error) {
      console.log('CATCH:', error);
      res.status(400).send('/add no:01; FAILED');
      return;
   }
   let sqlUpdate = `UPDATE rezervacie SET startI=?, endI=? WHERE userID=? AND tstampOfDay=?`;
   let sqlInsert = `INSERT INTO rezervacie (startI,endI,userId,tstampOfDay) VALUES (?,?,?,?)`;
   let sqlDelete = `DELETE from rezervacie where tstampOfDay=? and userId=?`;
   console.log('length:', rowsData.length);

   if (rowsData.length === 0) {
      for (let i = 0; i < timeStampKeys.length; i++) {
         const timestamp = timeStampKeys[i];
         try {
            const { minI, maxI } = newRezervacie[timestamp];
            console.log('Q1 before');
            // await dbP.query(sqlInsert, [minI, maxI, userId, timestamp]);
            await myQuery({ sqlOption: sqlInsert, minI, maxI, userId, timestamp });
            console.log('Q1 after');
         } catch (error) {
            console.log('CATCH:', error);
            res.status(400).send('/add no:02; FAILED');
            return;
         }
      }
      console.log('SEND1 200');
      res.status(200).send('OK');
      return;
   } else {
      try {
         for (let i = 0; i < timeStampKeys.length; i++) {
            const timestamp = timeStampKeys[i];
            const { minI, maxI } = newRezervacie[timestamp];
            const zhoda = rowsData.find((row) => row.tstampOfDay == timestamp);

            if (zhoda) {
               if (minI === -1 || maxI === -1) {
                  console.log('Q2 before');
                  // await dbP.query(sqlDelete, [timestamp, userId]);
                  await myQuery({ sqlOption: sqlDelete, timestamp, userId, type: 'DELETE' });
                  console.log('Q2 after');
               } else {
                  console.log('Q3 before');
                  // await dbP.query(sqlUpdate, [min, maxI, userId, timestamp]);
                  await myQuery({ sqlOption: sqlUpdate, minI, maxI, userId, timestamp });
                  console.log('Q3 after');
               }
               console.log('maubeeee');
            } else {
               if (minI !== -1 || maxI !== -1) {
                  console.log('Q4 before');
                  // await dbP.query(sqlInsert, [minI, maxI, userId, timestamp]);
                  await myQuery({ sqlOption: sqlInsert, minI, maxI, userId, timestamp });
                  console.log('Q4 after');
               }
            }

            console.log('maubeeee2');
         }
      } catch (e) {
         console.log('CATCHe:', e);
         res.status(400).send('/add no:03; FAILED');
         return;
      }

      console.log('SEND2 200');
      res.status(200).send('OK');
   }

   console.log('end_TUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU');
});

//TODO checkJWT
// router.get('/getRezervacie', checkJwt, async (req, res) => {
router.get('/getRezervacie', async (req, res) => {
   const today = moment().startOf('day');
   const sql = `SELECT * FROM rezervacie WHERE tstampOfDay >= ${today.valueOf()}`;
   db.query(sql, (err, result) => {
      console.log(result);
      if (err) {
         console.log('err - getRezervacie', err);
         res.status(400).send(err);
      } else {
         res.status(200).send(result);
      }
   });
});

//TODO checkJWT
router.post('/editHodiny', (req, res) => {
   const sql =
      'UPDATE cal_settings SET kapacita=?,maxNextDays=?, Pondelok_od=?,Pondelok_do=?, Utorok_od=?, Utorok_do=?, Streda_od=?,Streda_do=?, Stvrtok_od=?,Stvrtok_do=?,Piatok_od=?,Piatok_do=?,Sobota_od=?,Sobota_do=?,Nedela_od=?,Nedela_do=? WHERE id=1';
   const data = req.body.payload;
   console.log(data);
   db.query(sql, data, (err, result) => {
      if (err) {
         console.log('err - editHodiny', err);
         res.status(400).send(err);
      } else {
         res.status(200).send('OK');
      }
   });
});

router.get('/getCalendarSettings', (req, res) => {
   db.query('SELECT * FROM cal_settings', (err, result) => {
      if (err) {
         console.log('err - editHodiny', err);
         res.status(400).send(err);
      } else {
         res.status(200).send(result);
      }
   });
});

//TODO checkJWT
router.post('/add-zmena-otvorenie-specificky-den', async (req, res) => {
   //TODO checkJWT
   console.log('/calendar/add-zmena-otvorenie-specificky-den');
   console.log('body:', req.body);
   const { od, do: doo, datePicker: timestamp } = req.body.payload;
   let sql = `SELECT timestamp FROM specificke_dni WHERE timestamp=?`;
   let dataLength = [];

   try {
      const response = await dbP.query(sql, [timestamp]);
      console.log('response:', response[0]);
      dataLength = response[0].length;
      console.log('length', dataLength);

      if (dataLength === 0) {
         //INSERT
         sql = 'INSERT INTO `specificke_dni` (`timestamp`,od,`do`) VALUES (?,?,?)';
         await dbP.query(sql, [timestamp, od, doo]);
      } else {
         //UPDATE
         sql = 'UPDATE specificke_dni SET od=?,`do`=? WHERE `timestamp`=?';
         await dbP.query(sql, [od, doo, timestamp]);
      }
      res.status(200).send('OK');
      return;
   } catch (error) {
      console.log('CATCH:', error);
      res.status(400).send('/zmena-otvorenie-specificky-den no:01; FAILED');
      return;
   }
});

router.get('/get-zmena-otvorenie-specificky-den', (req, res) => {
   db.query('SELECT * FROM specificke_dni', (err, result) => {
      if (err) {
         console.log('err - /get-zmena-otvorenie-specificky-den', err);
         res.status(400).send(err);
      } else {
         res.status(200).send(result);
      }
   });
});

//TODO checkJWT
router.delete('/delete-zmena-otvorenie-specificky-den', (req, res) => {
   //TODO checkJWT
   console.log('body:', req.body);
   const timestamp = req.body.payload;
   console.log(timestamp);
   let sql = 'DELETE FROM `specificke_dni` WHERE timestamp=?';
   db.query(sql, timestamp, (err, result) => {
      if (err) {
         console.log('err - /delete-zmena-otvorenie-specificky-den', err);
         res.status(400).send(err);
      } else {
         res.status(200).json({ result });
      }
   });
});

module.exports = router;

async function myQuery(props) {
   // return new Promise(async (resolve, reject) => {
   console.log('props:', props);
   const { sqlOption, minI, maxI, userId, timestamp, type } = props;
   console.log('FUN', sqlOption);

   if (type === 'DELETE') {
      const promise = await dbP.query(sqlOption, [timestamp, userId]);
      console.log('FUN_QUERY');
      return promise;
   } else {
      const promise = await dbP.query(sqlOption, [minI, maxI, userId, timestamp]);
      console.log('FUN_QUERY');
      return promise;
   }
}

/*
.then(() => {
                     for (let index = 0; index < 3000; index++) {
                        if (index % 100 === 0) {
                           console.log(index);
                        }
                     }
                  });
*/
