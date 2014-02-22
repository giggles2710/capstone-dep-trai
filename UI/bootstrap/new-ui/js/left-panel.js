/**
 * Created by Là1 on 2/23/14.
 */

$("#button-toggle").mouseup(function () {
    $(this).hide();
    $("#new-button-toggle").show();
});


$("#new-button-toggle").mouseup(function () {
    $(this).hide();
    $("#button-toggle").show();
});
    

