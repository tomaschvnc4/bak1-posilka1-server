/**========================
 * Required External Modules
 ==========================*/

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cron = require('node-cron');
const moment = require('moment');
require('moment/locale/sk');
moment().locale('sk');
const { clientOrigins, serverPort } = require('./config/env.dev');

/**============
 * ADD
 ==============*/

const jwtAuthz = require('express-jwt-authz');

/*==============
 * App Variables
================*/

const app = express();
const { db } = require('./config/database');

const apiRouter = express.Router();
const { messagesRouter } = require('./messages/messages.router');

/*===================
 *  App Configuration
 ====================*/

app.use(helmet());
app.use(cors());
// app.use(cors({ origin: clientOrigins }));
app.use(express.json());

app.use('/api', apiRouter);
apiRouter.use('/messages', messagesRouter);

app.use(function (err, req, res, next) {
   if (err) {
      console.log(err);
      res.status(500).send(err.message);
   }

   // res.header('Access-Control-Allow-Origin', '*');
   // next();
});

/**
===========
ROUTES
===========
 */

const registerLoginRoute = require('./routes/register');
const calendarRoute = require('./routes/calendar');
const cennikRoute = require('./routes/cennik');
const profilRoute = require('./routes/profil');
const aliveRoute = require('./routes/alive');

app.use('/registerLogin', registerLoginRoute);
app.use('/calendar', calendarRoute);
app.use('/cennik', cennikRoute);
app.use('/profil', profilRoute);
app.use('/alive', aliveRoute);

/*==================
 * Scheduler
 ===================*/
const { zmazStare } = require('./sheduler/zmazStare');
const { aliveCheck } = require('./sheduler/aliveCheck');

cron.schedule('0 4 * * *', async () => {
   console.log('running');
   zmazStare();
});

cron.schedule('0,30 * * * * *', async () => {
   console.log('test');
   aliveCheck();
});

/*==================
 * Server Activation
 ===================*/

app.listen(process.env.PORT || serverPort, () =>
   console.log(`API Server listening on port ${process.env.PORT || serverPort}`)
);
// app.listen(4041, () => console.log(`API Server listening on port 4041`));
