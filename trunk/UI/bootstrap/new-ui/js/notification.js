/**
 * Created by Là1 on 1/2/14.
 */
$(document).ready(function () {
    $(".noti a").mousedown(function () {


        var mrgtb = parseInt($(this).css("margin-top"));

        var mrglf = parseInt($(this).css("margin-left"));

        mrgtb = mrgtb + 2;

        mrglf = mrglf + 0;

        $(this).css("margin-top", mrgtb + "px").css("margin-left", mrglf + "px");


    }).mouseup(function () {

            var mrgtb = parseInt($(this).css("margin-top"));

            var mrglf = parseInt($(this).css("margin-left"));

            mrgtb = mrgtb - 2;

            mrglf = mrglf - 0;

            $(this).css("margin-top", mrgtb + "px").css("margin-left", mrglf + "px");

        });

});

$(document).ready(function () {

    $(".event-request-icon").click(function () {
        var X = $(this).attr('id');
        if (X == 1) {
            $(".event-request-item").hide();
            $(this).attr('id', '0');
        }
        else {
            $(".event-request-item").show();
            $(this).attr('id', '1');
        }

        $(".notification-item, .message-item, .friend-request-item").hide();
        $(".noti-icon,.message-icon,.friend-request-icon").attr('id', '');
    });

    $(".friend-request-icon").click(function () {
        var X = $(this).attr('id');
        if (X == 1) {
            $(".friend-request-item").hide();
            $(this).attr('id', '0');
        }
        else {
            $(".friend-request-item").show();
            $(this).attr('id', '1');
        }

        $(".notification-item, .event-request-item, .message-item").hide();
        $(".noti-icon,.event-request-icon,.message-icon").attr('id', '');
    });

    $(".message-icon").click(function () {
        var X = $(this).attr('id');
        if (X == 1) {
            $(".message-item").hide();
            $(this).attr('id', '0');
        }
        else {
            $(".message-item").show();
            $(this).attr('id', '1');
        }

        $(".notification-item, .event-request-item,.friend-request-item").hide();
        $(".noti-icon,.event-request-icon,.friend-request-icon").attr('id', '');
    });

    $(".noti-icon").click(function () {
        var X = $(this).attr('id');
        if (X == 1) {
            $(".notification-item").hide();
            $(this).attr('id', '0');
        }
        else {
            $(".notification-item").show();
            $(this).attr('id', '1');
        }

        $(".event-request-item, .message-item, .friend-request-item").hide();
        $(".event-request-icon,.message-icon,.friend-request-icon").attr('id', '');
    });

//Mouse click on sub menu
    $(".notification-item, .event-request-item, .message-item, .friend-request-item").mouseup(function () {
        return false
    });

//Mouse click on my account link
    $(".noti-icon,.event-request-icon,.message-icon,.friend-request-icon").mouseup(function () {
        return false
    });


//Document Click
    $(document).mouseup(function () {
        $(".notification-item, .event-request-item, .message-item, .friend-request-item").hide();
        $(".noti-icon,.event-request-icon,.message-icon,.friend-request-icon").attr('id', '');
    });
});
