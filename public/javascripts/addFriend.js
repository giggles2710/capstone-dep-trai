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
            type: 'POST',
            url: '/addFriend/'+userId,
            data: {userId:userId},
            beforeSend: function(){
                $('#add-friend').html("<i class='fa fa-refresh fa-spin'></i>");
            },
            success: function(status, data){
                // if success, change button to cancel request
                $('#add-friend').attr('style','display:none');
                $('#cancel-request').show();
            },
            error: function(xhr, status, err){
                // var error = eval("("+xhr.responseText+")");
                var $errorBox = $('#error-box');
                $errorBox.show().html('<p>'+xhr.responseText+'</p>');
            }
        });
    }

})
