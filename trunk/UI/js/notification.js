/**
 * Created by Là1 on 1/2/14.
 */
$(document).ready(function () {

    $('#noti-icon').click(showBox1);
    $('#noti-icon span').mouseleave(hideBox1);

    function showBox1(e) {
        $('#noti-icon span').fadeIn().css(({ left: e.pageX, top: e.pageY }));
    }

    function hideBox1() {
        $('#noti-icon span').fadeOut();
    }

    $('#message-icon').click(showBox2).mouseleave(hideBox2);

    function showBox2(e) {
        $('#message-icon span').fadeIn().css(({ left: e.pageX, top: e.pageY }));
    }

    function hideBox2() {
        $('#message-icon span').fadeOut();
    }

    $('#event-request-icon').click(showBox3).mouseleave(hideBox3);

    function showBox3(e) {
        $('#event-request-icon span').fadeIn().css(({ left: e.pageX, top: e.pageY }));
    }

    function hideBox3() {
        $('#event-request-icon span').fadeOut();
    }

    $('#friend-request-icon').click(showBox4).mouseleave(hideBox4);

    function showBox4(e) {
        $('#friend-request-icon span').fadeIn().css(({ left: e.pageX, top: e.pageY }));
    }

    function hideBox4() {
        $('#friend-request-icon span').fadeOut();
    }

});
