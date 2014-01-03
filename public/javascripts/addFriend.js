/**
 * Created by Noir on 1/1/14.
 */

$('html').on('click','.add-friend-btn',function(event){
    // do the AJAX put
    event.preventDefault();
    var userId = $('#userId').val();
    if($(this).attr('id')=='add-friend'){
        // add friend
        $.ajax({
            type    : 'PUT',
            url     : '/addFriend/'+userId,
            beforeSend  : function(){
                $('.add-friend-btn').attr('style','display:none');
                $('#loading').show();
            },
            success     : function(status, data){
                // if success, change button to cancel request
                // hide loading
                $('#loading').attr('style','display:none');
                $('#cancel-request').show();
                // emit a socket event
                io.emit('addFriend:addFriend', owner);
            },
            error       : function(xhr, status, err){
                // var error = eval("("+xhr.responseText+")");
                var $errorBox = $('#error-box');
                $errorBox.show().html('<p>'+xhr.responseText+'</p>');
            }
        });
    }else if($(this).attr('id')=='cancel-request'){
        // cancel request
        $.ajax({
            type    : 'PUT',
            url     : '/cancelRequest/'+userId,
            beforeSend  : function(){
                $('.add-friend-btn').attr('style','display:none');
                $('#loading').show();
            },
            success     : function(status, data){
                // if success, change button to add friend
                $('#loading').attr('style','display:none');
                $('#add-friend').show();
            },
            error       : function(xhr, status, err){
                var $errorBox = $('#error-box');
                $error-box.show().html('<p>'+xhr.responseText+'</p>');
            }
        });
    }else if($(this).attr('id')=='unfriend'){
        // unfriend
        $.ajax({
            type    : 'PUT',
            url     : '/unfriend/'+userId,
            beforeSend  :function(){
                $('.add-friend-btn').attr('style','display:none');
                $('#loading').show();
            },
            success     : function(status, data){
                // if success, change button to add friend
                $('#loading').attr('style','display:none');
                $('#add-friend').show();
            },
            error: function(xhr, status, err){
                var $errorBox = $('#error-box');
                $error-box.show().html('<p>'+xhr.responseText+'</p>');
            }
        })
    }
});
