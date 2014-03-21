/**
 * Created by ConMeoMauDen on 19/03/2014.
 */

angular.module('my9time.event').controller('eventController', ['$scope' , '$rootScope','$navigate', '$location','UserSession', 'Event', '$routeParams', 'Helper','$http', function($scope , $rootScope, $navigate, $location ,Session, Event, $routeParams, Helper, $http){
    $scope.date = new Date();
    $scope.default = {
        dates: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [1,2,3,4,5,6,7,8,9,10,11,12],
        years: getAllYears(),
        hours:[1,2,3,4,5,6,7,8,9,10,11,12],
        minutes:[15,30,45],
        steps:['AM','PM']
    };

    /**
     * Biến
     */
    $scope.global = Session;
    $scope.updateError = '';
    $scope.isUpdateError = false;
    $scope.currentUser =[];
    $scope.isNoted =false;
    $scope.noted =[];
    $scope.notNoted =[];
    $scope.isCreator = false;
    $scope.isParticipate = false;
    $scope.isCreatorNote = false;
    $scope.memberNumber = 1;

    $scope.slidePage = function (path,type) {
        $navigate.go(path,type);
    };

    $scope.back = function(){
        $navigate.back();
    }

    // get event
    $scope.findOne = function() {
        checkCreator();
        checkParticipate();
        console.log('Event Controller - FindOne()');
        Event.get({
            id: $routeParams.id
        }, function(event) {

            console.log('Event - findOne');

            //========================================================
            //If this is a private event.Only owner can see it!
            if(event.privacy == 'p' && $scope.isCreator == false ){
                $location.path('/homepage');
            }

            //==========================================================
            // If this is the event of a group. Only group members and creator can see it !
            if(event.privacy == 'g' && $scope.isParticipate == false){
                $location.path('/homepage');
            }
            // kiểm tra người tạo  đã viết note chưa
            if(event.creator.note.content){
                $scope.isCreatorNote = true;
            }
            // get note list
            event.user.forEach(function(user){
                //lấy note của người dùng hiện tại
                if(user.status == 'a' || user.status == 'm'){
                    if(user.userID == $scope.global.userId){
                        $scope.currentUser.push(user);
                        // kiểm tra người dùng hiện tại đã viết note chưa
                        if(user.note.content){
                            $scope.isNoted = true;
                        }
                    }
                    else{
                        // phân loại người dùng còn lại thành 2 loại là đã viết note và chưa
                        if(!user.note.content){
                            $scope.notNoted.push(user);
                        }
                        else{
                            $scope.noted.push(user);
                        }
                    }
                }
            })

            // initiation
            $scope.event = event;
            // get number of members
            if(event.user.length != 0){
                $scope.memberNumber = event.user.length;
            }

            // convert string to date time
            var startTime = new Date(event.startTime);
            if(event.endTime != "" && event.endTime){
                var endTime = new Date(event.endTime);
            }
            else endTime = "";
            $scope.event.startTime =formatFullDate(startTime);
            if(endTime !=""){
                $scope.event.endTime = formatFullDate(endTime);
            }
            else $scope.event.endTime = "";
            $scope.date1 = startTime.getDate();
            $scope.month1 =startTime.getMonth();
            $scope.year1 = startTime.getFullYear();
            $scope.hour1 =startTime.getHours();
            $scope.minute1 = startTime.getMinutes();
            if(startTime.getHours()>12){
                $scope.step1 = "PM";
            }
            else $scope.step1 = "AM";
            $scope.date2 = endTime.getDate() ;
            $scope.month2 = endTime.getMonth();
            $scope.year2 = endTime.getFullYear();
            $scope.hour2 = endTime.getHours();
            $scope.minute2 = endTime.getMinutes();
            if(startTime.getHours()>12){
                $scope.step2 = "PM";
            }
            else $scope.step2 = "AM";

            // Event tra ve
            console.log('Event:    ' + event);

        });

    };


    $scope.addComment = function(){
        // Tạo 1 comment mới
        console.log(JSON.stringify($scope.global));
        var comment = {
            username: $scope.global.username,
            fullName: $scope.global.fullName,
            avatar: $scope.global.avatar,
            datetime: new Date(),
            content: $scope.inputComment
        }

        // Làm việc với Server
        Event.addComment({id: $routeParams.id},{comment: comment}, function(event){
            // Sau khi Save vào database, server sẽ trả về 1 cái ID
            // Sử dụng các thứ có được ghi ra HTML
            console.log(event);
            $scope.event.comment.push({_id: event.idComment, username: $scope.global.username, content: comment.content, datetime: new Date()});

        })
        // Xóa trống chỗ nhập Comment, chuẩn bị cho comment tiếp theo
        $scope.inputComment = '';

    };

    // update event Intro
    $scope.updateIntro = function(){
        $http({
            method: 'PUT',
            url:    '/api/updateEventIntro',
            data: $.param({
                eventId: $scope.event._id,
                name: $scope.event.name,
                date1:$scope.date1,
                month1:$scope.month1,
                year1:$scope.year1,
                hour1:$scope.hour1,
                minute1:$scope.minute1,
                step1:$scope.step1,
                date2:$scope.date2,
                month2:$scope.month2,
                year2:$scope.year2,
                hour2:$scope.hour2,
                minute2:$scope.minute2,
                step2:$scope.step2,
                location: $scope.event.location,
                description: $scope.event.description}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                var startTime = new Date(data.startTime);
                var endTime = new Date(data.endTime);
                $scope.event.name= data.name;
                $scope.event.startTime =formatFullDate(startTime);
                $scope.event.endTime=formatFullDate(endTime);
                $scope.event.location=data.location;
                $scope.event.description=data.description;

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    };



    // update event Announcement
    $scope.updateAnnouncement = function(){
        $http({
            method: 'PUT',
            url:    '/api/updateAnnouncement',
            data: $.param({eventId: $scope.event._id, announcement: $scope.event.announcement}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $scope.event.announcement=data.announcement;

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    };

    // get event intro
    $scope.getIntro = function(){
        $http({
            method: 'GET',
            url:    '/api/getEventIntro',
            data: $.param({eventId: $routeParams.id}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $scope.event.name= data.name;
                $scope.event.startTime =formatFullDate(data.startTime);
                $scope.event.endTime=formatFullDate(data.endTime);
                $scope.event.location=data.location;
                $scope.event.description=data.description;

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    };

    // get event announcement
    $scope.getAnnouncement = function(){
        $http({
            method: 'GET',
            url:    '/api/getAnnouncement',
            data: $.param({eventId: $routeParams.id}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $scope.event.announcement=data.announcement;
            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    };
    // edit creator's note
    $scope.editNoteCreator = function(){
        $http({
            method: 'PUT',
            url:    '/api/updateNoteCreator',
            data: $.param({eventId: $routeParams.id,title: $scope.noteTitleCreator, content: $scope.noteContentCreator}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $('#edit'+$scope.event.creator.userID).modal('toggle');

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    }
    // create creator's note
    $scope.createNoteCreator = function(){
        $http({
            method: 'PUT',
            url:    '/api/updateNoteCreator',
            data: $.param({eventId: $routeParams.id,title: $scope.noteTitleCreator, content: $scope.noteContentCreator}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $('#write'+$scope.event.creator.userID).modal('toggle');
                $scope.isCreatorNote = true;

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    }

    // create user's note
    $scope.editNoteUser = function(){
        $http({
            method: 'PUT',
            url:    '/api/updateNoteUser',
            data: $.param({eventId: $routeParams.id,title: $scope.noteTitleUser, content: $scope.noteContentUser}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $('#edit'+$scope.global.userId).modal('toggle');

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    }
    // create user's note
    $scope.createNoteUser = function(){
        $http({
            method: 'PUT',
            url:    '/api/updateNoteUser',
            data: $.param({eventId: $routeParams.id,title: $scope.noteTitleUser, content: $scope.noteContentUser}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $('#write'+$scope.global.userId).modal('toggle');
                $scope.isNoted = true;

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    }

    //get all years
    function getAllYears(){
        var years = [];
        var today = new Date();
        years.push(today.getFullYear());
        for(var i=new Date().getFullYear();i < new Date().getFullYear() +10;i++){
            years.push(i);
        }

        return years;
    }

    // format date
    function formatFullDate(input){
        if(input != ""){
            var date = new Date(input);
            date.setMonth(date.getMonth());
            return date.getHours() + ':' + date.getMinutes() + ' ,' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        }
        else return input
    }

    //check creator
    function checkCreator(){
        $http({
            method: 'POST',
            url:    $rootScope.LOCALHOST + '/api/checkCreator',
            data: $.param({
                eventId: $routeParams.id,
                userID: $scope.global.userId
            }),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                if(data == "true"){
                    $scope.isCreator = true;
                }
                if(data == "false"){
                    $scope.isCreator = false;
                }
            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    }

    //checkParticipate
    function checkParticipate(){
        $http({
            method: 'POST',
            url:    $rootScope.LOCALHOST + '/api/checkParticipate',
            data: $.param({
                eventId: $routeParams.id,
                userID: $scope.global.userId
            }),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                if(data == "true"){
                    $scope.isParticipate = true;
                }
                if(data == "false"){
                    $scope.isParticipate = false;
                }
            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    }

}]);




