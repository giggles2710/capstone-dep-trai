/**
 * Created by Noir on 1/2/14.
 */

// listen for the update friend request event.
io.on('updateFriendRequest',function(data){
    // check if owner is online
    if(data.toId == onliner){
        // update friend request count
        $('#notification-count').html(data.count);
    }
});
