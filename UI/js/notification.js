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
