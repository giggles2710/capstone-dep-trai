/**
 * Created by Noir on 2/20/14.
 */

angular.module('my9time.event').controller('TimeshelfController', ['$scope','$location','UserSession','Event','$routeParams','$q','$http','Helper','$window',function($scope,$location,Session,Event,$routeParams,$q,$http,Helper,window){
    $('body').addClass('edit-body');
    // binding click event to open to-do window
    $('#btn').on('click',function(){
        if($('#tdl-spmenu-s2').hasClass('tdl-spmenu-open')){
            $('#tdl-spmenu-s2').removeClass('tdl-spmenu-open');
        }else{
            $('#tdl-spmenu-s2').addClass('tdl-spmenu-open');
        }
    });
    // make to-do window follows when scroll
    var $sidebar   = $("#tdl-spmenu-s2"),
        $window    = $(window),
        offset     = $sidebar.offset(),
        topPadding = 15;

    $window.scroll(function() {
        if ($window.scrollTop() > offset.top) {
            $sidebar.stop().animate({
                marginTop: $window.scrollTop() - offset.top + topPadding
            });
        } else {
            $sidebar.stop().animate({
                marginTop: 0
            });
        }
    });

    // Created by Nam
    // Notifications
    // =================================================================================================================
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
    // =================================================================================================================

    // Created by Nam
    // To-do
    // =================================================================================================================
    var elems = document.getElementsByTagName("input"), i;
    for (i in elems) {
        if (elems[i].type == "checkbox") {

            if (elems[i].checked) //alert(this.id + " is checked");
            //if (elems[i].checked)
                $("label[for=" + elems[i].id + "]").css("text-decoration", "line-through");
            else $("label[for=" + elems[i].id + "]").css("text-decoration", "none");

            $("#" + elems[i].id).change(function () {
                if ($(this).is(':checked')) //alert(this.id + " is checked");
                //if (elems[i].checked)
                    $("label[for=" + this.id + "]").css("text-decoration", "line-through");
                else $("label[for=" + this.id + "]").css("text-decoration", "none");
                //alert(elems[i].id + " is not checked");
            });
        }
    }
    // =================================================================================================================
    // ANGULAR

    $scope.isAtTop = true;
    $scope.global = Session;
    $scope.friends = [];
    $scope.posts = [];
    $scope.ownerId = $routeParams.userId;

    $scope.initialize = function(){
        console.log('getting all friend token inputs')
        $http({
            method:'GET',
            url:'/api/timeshelf/'+$scope.ownerId
        })
            .success(function(res){
                console.log('posts loaded');
                $scope.posts = res.events;
                $scope.user = res.user;
            });
    }

    // jquery event
    $('a.nav-item').on('click',function(e){
        e.preventDefault();

        var url = $(this).attr('href');
        window.location.href = url;
//        $location.path(url);
//        Helper.apply($scope);
    })
}]);
