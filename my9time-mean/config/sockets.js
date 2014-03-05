/**
 * Created by Noir on 3/3/14.
 */
'use strict';

module.exports = function(io) {
    require('../app/sockets/users/homepageSocket')(io);
    require('../app/sockets/users/messageSocket')(io);
    require('../app/sockets/users/userSocket')(io);
};