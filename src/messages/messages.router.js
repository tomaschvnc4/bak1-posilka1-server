/**
 * Required External Modules and Interfaces
 */

const express = require('express');
const {
   getPublicMessage,
   getProtectedMessage,
   getProtectedMessageRole,
} = require('./messages.service');
const { checkJwt, checkPermission } = require('../Middlewares/authz/check-jwt');

/**
 * Router Definition
 */

const messagesRouter = express.Router();

/**
 * Controller Definitions
 */

// GET messages/

messagesRouter.get('/public-message', (req, res) => {
   const message = getPublicMessage();
   res.status(200).send(message);
});

messagesRouter.get('/protected-message', checkJwt, (req, res) => {
   const message = getProtectedMessage();
   console.log(req.user.sub);
   res.status(200).send(message);
});

messagesRouter.get('/role', checkJwt, checkPermission, (req, res) => {
   const message = getProtectedMessageRole();
   res.status(200).send(message);
});

module.exports = {
   messagesRouter,
};
