/**
 * Created by Noir on 1/3/14.
 */

$('html').on('click','#notification-count',function(req,res){
    // call ajax to get list of friend request, background = grey if this request is unread
    if($('#notification-list').hasClass('is-show')){
        $('#notification-list').attr('style','display:none');
        $('#notification-list').removeClass('is-show');
    }else{
        $.ajax({
            type:'GET',
            url:'/ajaxGetFriendRequest',
            beforeSend:function(){
                // open notification box, and indicate that it's loading
                $('#notification-count').html('0');
                $('#notification-list').show();
                $('#notification-list').addClass('is-show');
                $('#notification-list').html('<span><i class="fa fa-refresh fa-spin"></i> loading...</span>');
            },
            success:function(data, status){
                // display friend request list, background = grey item that is unread.
                $('#notification-list').empty();
                // parse data
                var requestHTML = "";
                if(data != 'none'){
                    for(var i=0;i<data.length;i++){
                        var request = data[i];
                        if(request.isRead){
                            requestHTML += '<li><p>From: ' +
                                '<a href="'+request.fromId+'">'+request.fromName+'</a>' +
                                '</p></br>' +
                                '<button class="btn-primary btn-xs confirm-btn" link="/confirmFriendRequest/'+request.fromId+'">confirm</button>' +
                                '<button class="btn btn-default btn-xs" style="display:none" disabled><i class="fa fa-refresh fa-spin"></i> loading... </button>';
                        }else{
                            requestHTML += '<li style="background: #808080"><p>From: ' +
                                '<a href="'+request.fromId+'">'+request.fromName+'</a>' +
                                '</p></br>' +
                                '<button class="btn-primary btn-xs confirm-btn" link="/confirmFriendRequest/'+request.fromId+'">confirm</button>' +
                                '<button class="btn btn-default btn-xs" style="display:none" disabled><i class="fa fa-refresh fa-spin"></i> loading... </button>';
                        }

                    }
                    $('#notification-list').html(requestHTML);
                }else{
                    $('#notification-list').html('<span>there is no request</span>');
                }
            },
            error:function(xhr, status, err){
                // show error in error box.
                var $errorBox = $('#error-box');
                $error-box.show().html('<p>'+xhr.responseText+'</p>');
            }
        });
    }
});

$('html').on('click','button.confirm-btn',function(){
    var $btnConfirm =$(this);
    var url = $btnConfirm.attr('link');
    // call ajax to confirm request
    $.ajax({
        type: 'PUT',
        url: url,
        beforeSend:function(){
            $btnConfirm.attr('style','display:none'); // hide button confirm
            $btnConfirm.next().show(); // show loading button
        },
        success:function(data, status){
            // data
            if(data=='confirmed'){
                // remove friend request
                $btnConfirm.parent().remove();
            }
        },
        error:function(xhr, status, err){
            $btnConfirm.next().attr('style','display:none');
            $btnConfirm.show();
            // show error in error box.
            var $errorBox = $('#error-box');
            $error-box.show().html('<p>'+xhr.responseText+'</p>');
        }
    });
});
