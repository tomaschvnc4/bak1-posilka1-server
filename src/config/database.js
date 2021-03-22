const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');

const db = mysql.createPool({
   host: 'eu-cdbr-west-03.cleardb.net',
   user: 'b54705c383c289',
   password: '3538799c',
   database: 'heroku_c4214c6f9091322',
   // connectionLimit: 10,
});

const dbP = mysqlPromise.createPool({
   host: 'eu-cdbr-west-03.cleardb.net',
   user: 'b54705c383c289',
   password: '3538799c',
   database: 'heroku_c4214c6f9091322',
   // connectionLimit: 10,
});

module.exports = { db, dbP };

//mysql://b54705c383c289:3538799c@eu-cdbr-west-03.cleardb.net/heroku_c4214c6f9091322?reconnect=true
