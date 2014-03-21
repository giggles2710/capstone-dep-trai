/**
 * Created by Nova on 2/10/14.
 */
//==========================================================================================================================
// CreatePage Controller
angular.module('my9time.event').controller('createEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http','$translate','Modal',
    function($scope , $location ,Session, Event, $routeParams, Helper, $http,$translate,modal){
    $scope.global = Session;
    var date = new Date();
    $scope.createError = '';
    $scope.isCreateError = false;
    $scope.startTime ='';
    $scope.endTime='';
    $scope.privacy="c";
    $scope.color="ffffff";
    $scope.alarm = true;
    $scope.default = {
        dates: [date.getDate(),1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [(date.getMonth()+1),1,2,3,4,5,6,7,8,9,10,11,12],
        years: getAllYears(),
        hours:[1,2,3,4,5,6,7,8,9,10,11,12],
        minutes:[1,15,30,45],
        steps:['AM','PM']
    };

        // create event
    $scope.create = function(){
        var event = new Event({
            userId:$scope.global.userId,
            name :$scope.name,
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
            description :$scope.description,
            location: $scope.location,
            privacy: $scope.privacy,
            color:$scope.color,
            alarm:$scope.alarm

        });
        event.$save(function(response){
            if(!response){
                $scope.isCreateError = true;
                $scope.createError = "Sorry about this !"
            }
            else{
                $http({
                    method:'PUT',
                    url:'/api/invite/',
                    data: $.param({eventId: $scope.eventId, friends: $scope.friends, invitors: $scope.invitors}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        // emit an event to update event request
//                        userSocket.emit('eventRequestSent',{users:data});
                        // close modal
                        modal.close();
                    });
                modal.close();
                $location.path('/event/view/'+ response._id);
            }


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

    // TrungNM: Thu nghiem crop
    $scope.onSelect = function() {
        console.log('Yolo DDCM');
    };



}]);




//===============================================================================================================================================================================================================
//View,Edit page Controller

angular.module('my9time.event').controller('viewEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http', '$fileUploader', '$timeout','$route', function($scope , $location ,Session, Event, $routeParams, Helper, $http, $fileUploader, $timeout, $route){
    $scope.date = new Date();
    $scope.default = {
        dates: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [1,2,3,4,5,6,7,8,9,10,11,12],
        years: getAllYears(),
        hours:[1,2,3,4,5,6,7,8,9,10,11,12],
        minutes:[15,30,45],
        steps:['AM','PM']
    };
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
            url:    '/api/checkCreator',
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
            url:    '/api/checkParticipate',
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


    // get event
    $scope.findOne = function() {
        checkCreator();
        checkParticipate();
        Event.get({
            id: $routeParams.id
        }, function(data) {
            Helper.findRightOfCurrentUser([data],$scope.global.userId,0,function(err,events){
                var event = events[0];
                //========================================================
                //If this is a private event.Only owner can see it!
                if(event.privacy == 'p' && $scope.isCreator == false ){
                    $location.path('/');
                }

                //==========================================================
                // If this is the event of a group. Only group members and creator can see it !
                if(event.privacy == 'g' && $scope.isParticipate == false){
                    $location.path('/');
                }
                // ki?m tra ng??i t?o  ?ã vi?t note ch?a
                if(event.creator.note.content){
                    $scope.isCreatorNote = true;
                }
                // get note list
                event.user.forEach(function(user){
                    //l?y note c?a ng??i dùng hi?n t?i
                    if(user.status == 'confirmed'){
                        if(user.userID == $scope.global.userId){
                            $scope.currentUser.push(user);
                            // ki?m tra ng??i dùng hi?n t?i ?ã vi?t note ch?a
                            if(user.note.content){
                                $scope.isNoted = true;
                            }
                        }
                        else{
                            // phân lo?i ng??i dùng còn l?i thành 2 lo?i là ?ã vi?t note và ch?a
                            if(user.note.content){
                                $scope.noted.push(user);
                            }
                            else{
                                $scope.notNoted.push(user);
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
            });

        });
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


    /**
     * TrungNM - Upload Multiple File
     */
    var multipleFile = $scope.uploader = $fileUploader.create({
        scope: $scope,                          // to automatically update the html. Default: $rootScope
        url: '/api/users/multipleFileUpload',
        formData: [
            { eventID: $routeParams.id}
        ],
        filters: [
            function (items) {                    // first user filter
                console.info('Filter Multiple File Upload');
                console.log('File uploaded:  ' + items);
                return true;
            }
        ]
    });
    multipleFile.bind('completeall', function (event, items) {
        console.log('Complete All:    ' + items);
    });

}]);


/**
 * TrungNM - commentEventController
 */
angular.module('my9time.event').controller('commentEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http','$translate', '$fileUploader', 'Users' ,function($scope , $location ,Session, Event, $routeParams, Helper, $http,$translate, $fileUploader, Users){
    $scope.global = Session;
    $scope.event = '';
    $scope.user = '';

    $scope.inputComment = '';
    $scope.items = ['item1', 'item2', 'item3'];

    // Tìm EventDetail
    $scope.findOne = function() {
//            Get event information
        Event.get({
            id: $routeParams.id
        }, function(event) {
            // TODO: Check lại cho đầy đủ
            $scope.event = event;
            $scope.startTime =event.startTime;
            $scope.endTime = event.endTime;
        });

        // Get User information
        Users.getProfile({
            id: $scope.global.userId
        }, function (user) {
            //TODO: coi lại cách hiển thị ( Fullname, birthday ... )
            $scope.user = user;
        });
    };

    // Thêm Comment
    // TODO: Cập nhật vào trang đi đcm
    $scope.addComment = function(){
        // Tạo 1 comment mới
        var comment = {
            username: $scope.user.local.username,
            fullName: $scope.user.firstName + " " + $scope.user.lastName,
            avatar: $scope.user.avatar,
            datetime: new Date(),
            content: $scope.inputComment
        }

        // Làm việc với Server
        Event.addComment({id: $routeParams.id},{comment: comment}, function(event){
            // Sau khi Save vào database, server sẽ trả về 1 cái ID
            // Sử dụng các thứ có được ghi ra HTML
            $scope.event.comment.push({_id: event.idComment, avatar:$scope.user.avatar, fullName:$scope.user.firstName, username: $scope.user.local.username, content: $scope.inputComment, datetime: new Date()});

        })
        // Xóa trống chỗ nhập Comment, chuẩn bị cho comment tiếp theo
        $scope.inputComment = '';

    };

    // Xóa Comment
    // TODO: coi lại delete nè
    $scope.removeComment = function(comment){
        Event.removeComment({id: $routeParams.id},{comment: comment}, function(){

        })
        $scope.event.comment.splice($scope.event.comment.indexOf(comment), 1);
    }

}]);

/**
 * TrungNM - fileUploadEventController
 */
angular.module('my9time.event').controller('fileUploadEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http','$translate', '$fileUploader', 'Users' ,function($scope , $location ,Session, Event, $routeParams, Helper, $http,$translate, $fileUploader, Users){
    var photoUpload = $scope.uploader = $fileUploader.create({
        scope: $scope,                          // to automatically update the html. Default: $rootScope
        url: '/api/event/multipleFileUpload',
        formData: [
            { eventID: $routeParams.id}
        ],
        filters: [
            function (items) {                    // first user filter
                console.info('Filter Photo Multiple File Upload');
                console.log('File uploaded:  ' + items);
                return true;
            }
        ]
    });
    photoUpload.bind('completeall', function (event, items) {
        console.log('Complete All:    ' + items);
    });


}]);


/**
 * TrungNM - fileUploadEventController
 */
angular.module('my9time.event').controller('coverEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http','$translate', '$fileUploader', 'Users', '$timeout', '$route' ,function($scope , $location ,Session, Event, $routeParams, Helper, $http,$translate, $fileUploader, Users, $timeout, $route){
    $scope.tmpCords = '';
    // Tìm EventDetail
    $scope.findOne = function() {
//            Get event information
        Event.get({
            id: $routeParams.id
        }, function(event) {
            // TODO: Check lại cho đầy đủ
            $scope.event = event;
            $scope.startTime =event.startTime;
            $scope.endTime = event.endTime;
        });

        // Get User information
        Users.getProfile({
            id: $scope.global.userId
        }, function (user) {
            //TODO: coi lại cách hiển thị ( Fullname, birthday ... )
            $scope.user = user;
        });
    };

    var coverUpload = $scope.coverUploader = $fileUploader.create({
        scope: $scope,                          // to automatically update the html. Default: $rootScope
        url: '/api/event/view/:id/uploadCover',
        formData: [
            { eventID: $routeParams.id }
        ],
        filters: [
            function (items) {                    // first user filter
                console.info('Filter Photo Multiple File Upload');
                console.log('File uploaded:  ' + items);
                return true;
            }
        ]
    });
    // Sau khi add file thành công
    coverUpload.bind('afteraddingall', function (event, items) {
        $('#cover-button').click();
    });
    coverUpload.bind('completeall', function (event, items) {
        $route.reload();
        $timeout(function(){$('#crop-cover-modal').modal('toggle'); },1000);
    });

    /**
     * TrungNM - Crop Avatar
     */
    $scope.selected = function () {
        console.log($scope.event.cover);
        Event.cropCover({id: $routeParams.id}, {selected: $scope.tmpCords, cover: $scope.event.cover }, function (err) {
            $('#crop-cover-modal').modal('toggle');
            $timeout(function(){$route.reload();},1000);

        })

    };


    /**
     * TrungNM - Upload Avatar
     */
    $scope.uploadCover = function () {
        $('#upload-cover').click();
    }



}]);



