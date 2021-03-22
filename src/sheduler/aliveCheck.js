const fetch = require('node-fetch');

const aliveCheck = async () => {
   const response = await fetch('http://localhost:4041/alive/');
   const data = await response.json();
   console.log('response', data);
   // fetch('https://mysql-bak-posilka1.herokuapp.com/alive/');
};

module.exports = { aliveCheck };
