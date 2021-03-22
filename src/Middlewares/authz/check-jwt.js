const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { domain, audience } = require('../../config/env.dev');

const checkJwt = jwt({
   secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${domain}/.well-known/jwks.json`,
   }),

   audience: audience,
   issuer: `https://${domain}/`,
   algorithms: ['RS256'],
});

/*** */
const jwtAuthz = require('express-jwt-authz');

const checkPermission = jwtAuthz(['all'], { customScopeKey: 'permissions' });
// const checkPermission = jwtAuthz(['read:test1'], { customScopeKey: 'permissions' });

module.exports = {
   checkJwt,
   checkPermission,
};
