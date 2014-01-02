/**
 * Created by Noir on 1/2/14.
 */

// listen for the update friend request event.
io.on('updateFriendRequest',function(data){
    // check if owner is online
    if(data.toId == onliner){
        $('#friendRequestBox').append('\nUnread: ' + data.count + ' updated at ' + new Date());
    }
});
