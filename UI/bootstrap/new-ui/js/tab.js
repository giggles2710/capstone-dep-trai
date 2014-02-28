/**
 * Created by Là1 on 2/28/14.
 */
$(document).ready(function () {

    $("#link-profile-info").click(function () {
        $("#tab-profile-info").addClass("active");
        $("#tab-profile-friend").removeClass("active");
    });

    $("#link-profile-friend").click(function () {
        $("#tab-profile-friend").addClass("active");
        $("#tab-profile-info").removeClass("active");
    });

});
