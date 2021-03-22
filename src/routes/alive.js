const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   console.log('ALIVE');
   res.status(200).json('OK');
});

module.exports = router;
