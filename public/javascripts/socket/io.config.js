/**
 * Created by Noir on 1/2/14.
 */
var onliner = $('#onlinerId').val();
var owner = $('#ownerId').val();
io = io.connect();
// emit ready event with room name
io.emit('ready', owner);