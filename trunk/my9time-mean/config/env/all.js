'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
	db: process.env.MONGOHQ_URL,
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: '123456789',
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',
    recaptchaPublicKey: '6LehqfESAAAAAHodY0j5z6hq_B7Xdi6Kpc0Yb7cL',
    recaptchaPrivateKey: '6LehqfESAAAAAGuJN0kMKt-8tEl3sPB7q0EgRXQc'
}
