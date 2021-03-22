const express = require('express');
const { db } = require('../config/database');

const moment = require('moment');
require('moment/locale/sk');
moment().locale('sk');

const zmazStare = () => {
   console.log('Mazanie...');
   const now = moment().startOf('day').valueOf();
   console.log(now);
   db.query('DELETE FROM rezervacie WHERE tstampOfDay<?', now, (err, result) => {
      err && console.log(err);
      console.log('SHEDULE-DELETE', result);
   });
   db.query('DELETE FROM specificke_dni WHERE `timestamp`<?', now, (err, result) => {
      err && console.log(err);
      console.log('SHEDULE-DELETE-2', result);
   });
};

module.exports = { zmazStare };
