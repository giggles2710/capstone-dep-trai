/**
 * Created by Nova on 2/10/14.
 */
//==========================================================================================================================
// CreatePage Controller
angular.module('my9time.event').controller('createEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http','$translate','Modal', 'EventSocket','$window','$route',
    function($scope , $location ,Session, Event, $routeParams, Helper, $http,$translate,modal,eventSocket,window,$route){
    $scope.global = Session;
    var date = new Date();
    $scope.createError = '';
    $scope.isCreateError = false;
    $scope.startTime ='';
    $scope.endTime='';
    $scope.privacy="c";
//    $scope.color="ffffff";
//    $scope.alarm = true;
    $scope.default = {
        dates: [date.getDate(),1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [(date.getMonth()+1),1,2,3,4,5,6,7,8,9,10,11,12],
        years: getAllYears(),
        hours:[1,2,3,4,5,6,7,8,9,10,11,12],
        minutes:[0,10,20,30,40,50],
        steps:['AM','PM']
    };

        // create event
    $scope.create = function(){
        var event = new Event({
            userId:$scope.global.userId,
            name :$scope.name,
            date1:$scope.date1,
            month1:$scope.month1 -1,
            year1:$scope.year1,
            hour1:$scope.hour1,
            minute1:$scope.minute1,
            step1:$scope.step1,
            date2:$scope.date2,
            month2:$scope.month2-1,
            year2:$scope.year2,
            hour2:$scope.hour2,
            minute2:$scope.minute2,
            step2:$scope.step2,
            description :$scope.description,
            location: $scope.location,
            privacy: $scope.privacy
            //color:$scope.color,
            //alarm:$scope.alarm

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

    // faceBook share
    $scope.facebookShare = function(event){
            var description = event.description;
            if(!event.description) description = '';
            FB.ui(
                {
                    method: 'feed',
                    name: event.name,
                    link: 'http://www.my9time.fwd.wf/event/view/' + event._id,
                    picture: 'https://24.media.tumblr.com/cee36199051043d10583cfb7accc47cc/tumblr_n3zakvtIpd1qg8reto1_400.png',
                    caption: description,
                    message: ''
                });
        }

        // create event  by clicking calendar
        $scope.createEventCalendar = function(a,b,c){
            var date1 = Number(a);
            var month1= Number(b);
            var year1= Number(c);
            var event = new Event({
                userId:$scope.global.userId,
                name :$scope.name,
                date1: date1,
                month1: month1,
                year1: year1,
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
                privacy: $scope.privacy
                //color:$scope.color,
                //alarm:$scope.alarm

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
                   // $location.path('/event/view/'+ response._id);
                    //$location.path('/calendar');
                    //window.location.href = '/calendar';
                    $route.reload()

                }


            })
        }


    //get all years
    function getAllYears(){
        var years = [];
        for(var i=new Date().getFullYear();i < new Date().getFullYear() +10;i++){
            years.push(i);
        }

        return years;
    }

}]);




//===============================================================================================================================================================================================================
//View,Edit page Controller

angular.module('my9time.event').controller('viewEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http', '$fileUploader', '$timeout','$route','Modal','EventSocket',
    function($scope , $location ,Session, Event, $routeParams, Helper, $http, $fileUploader, $timeout, $route,modal,eventSocket){
    $scope.date = new Date();
    $scope.default = {
        dates: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [1,2,3,4,5,6,7,8,9,10,11,12],
        years: getAllYears(),
        hours:[1,2,3,4,5,6,7,8,9,10,11,12],
        minutes:[1,10,20,30,40,50],
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
    $scope.isNullEvent = false;
    $scope.curPhoto = '';
    $scope.curTitle = '';
    $scope.curContent ='';

    //get all years
    function getAllYears(){
        var years = [];
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
             return date.getHours() + ':' + date.getMinutes() + ' ,' + date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();

        }
        else return input
    }


     //check isNullEvent $$ isBanned
    function checkIsNullEvent(){
        $http({
            method:'POST',
            url:   '/api/checkIsNullEvent',
            data: $.param({
                eventId: $routeParams.id
            }),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                if(data == "true"){
                    $scope.isNullEvent = true;
                    $location.path('/404');
                    console.log("isNullEvent " + $scope.isNullEvent)
                }
                if(data == "false"){
                    $scope.isNullEvent = false;
                    console.log("isNullEvent " + $scope.isNullEvent)
                }
            })

    }

    //check creator
//    function checkCreator(){
//        $http({
//            method: 'POST',
//            url:    '/api/checkCreator',
//            data: $.param({
//                eventId: $routeParams.id,
//                userID: $scope.global.userId
//            }),
//            headers:{'Content-Type':'application/x-www-form-urlencoded'}
//        })
//            .success(function(data, status){
//                if(data == "true"){
//                    $scope.isCreator = true;
//                }
//                if(data == "false"){
//                    $scope.isCreator = false;
//                }
//            })
//            .error(function(err){
//                $scope.isUpdateError= true;
//                $scope.updateError= err;
//            })
//    }

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
                if(data){
                    $scope.isParticipate = data.isParticipate;
                    $scope.isCreator = data.isCreator;
                    console.log("data " + data.isParticipate);
                    console.log("data " + data.isCreator);
                }


            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    }


    // get event
    $scope.findOne = function() {
        checkIsNullEvent();
        if($scope.isNullEvent == false){
        //checkCreator();
        checkParticipate();
        Event.get({
            id: $routeParams.id
        }, function(data) {
            Helper.findRightOfCurrentUser([data],$scope.global.userId,0,function(err,events){
                var event = events[0]
                //======================================================
                // if this event had been banned
                if(event.isBanned == true){
                    $location.path('/404');
                }
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
                // check if creator has note
                if(event.creator.note.content){
                    $scope.isCreatorNote = true;
                }
                // get note list
                event.user.forEach(function(user){
                    //get curUser note
                    if(user.status == 'confirmed'){
                        if(user.userID == $scope.global.userId){
                            $scope.currentUser.push(user);
                            // check if cur user has note
                            if(user.note.content){
                                $scope.isNoted = true;
                            }
                        }
                        else{
                            // have note List and not have Note List
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
                    for(var i = 0 ; i < event.user.length; i++){
                        if(event.user[i].status =='confirmed'){
                            $scope.memberNumber += 1;
                        }
                    }
                }

                // convert string to date time
                var startTime = new Date(event.startTime);
                $scope.event.startTime =formatFullDate(startTime);
                if(event.endTime != "" && event.endTime){
                    var endTime = new Date(event.endTime);
                    $scope.event.endTime = formatFullDate(endTime);
                }
                else endTime = "";
                $scope.date1 = startTime.getDate();
                $scope.month1 =startTime.getMonth()+1;
                $scope.year1 = startTime.getFullYear();
                $scope.minute1 = startTime.getMinutes();
                if(startTime.getHours()>12){
                    $scope.step1 = "PM";
                    $scope.hour1 =startTime.getHours()-12;
                }
                else{
                    $scope.step1 = "AM";
                    $scope.hour1 =startTime.getHours();
                }
                if(endTime){
                    $scope.date2 = endTime.getDate() ;
                    $scope.month2 = endTime.getMonth()+1;
                    $scope.year2 = endTime.getFullYear();
                    $scope.minute2 = endTime.getMinutes();
                    if(startTime.getHours()>12){
                        $scope.step2 = "PM";
                        $scope.hour2 = endTime.getHours()-12;
                    }
                    else{
                        $scope.step2 = "AM";
                        $scope.hour2 = endTime.getHours();
                    }
                }

            });

        });
        }
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
                month1:$scope.month1-1,
                year1:$scope.year1,
                hour1:$scope.hour1,
                minute1:$scope.minute1,
                step1:$scope.step1,
                date2:$scope.date2,
                month2:$scope.month2-1,
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
                $scope.event.name= data.name;
                var startTime = new Date(data.startTime);
                $scope.event.startTime =formatFullDate(startTime);
                if(data.endTime){
                var endTime = new Date(data.endTime);
                $scope.event.endTime=formatFullDate(endTime);
                }
                else $scope.event.endTime= "";
                $scope.date1 = startTime.getDate();
                $scope.month1 =startTime.getMonth()+1;
                $scope.year1 = startTime.getFullYear();
                $scope.minute1 = startTime.getMinutes();
                if(startTime.getHours()>12){
                    $scope.step1 = "PM";
                    $scope.hour1 =startTime.getHours()-12;
                }
                else{
                    $scope.step1 = "AM";
                    $scope.hour1 =startTime.getHours();
                }
                if(endTime){
                    $scope.date2 = endTime.getDate() ;
                    $scope.month2 = endTime.getMonth()+1;
                    $scope.year2 = endTime.getFullYear();
                    $scope.minute2 = endTime.getMinutes();
                    if(startTime.getHours()>12){
                        $scope.step2 = "PM";
                        $scope.hour2 = endTime.getHours()-12;
                    }
                    else{
                        $scope.step2 = "AM";
                        $scope.hour2 = endTime.getHours();
                    }
                }
                $scope.event.location=data.location;
                $scope.event.description=data.description;
                eventSocket.emit('newEventIntro',{'postId':$routeParams.id});
                modal.close();


            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    };

    // open edit event intro popup
        $scope.openEditEventIntroPopup = function(){
            modal.open($scope,'/views/component/eventIntroPopup.html',function(res){
//                $http.get('/js/locationLibrary.json').success(function(data){
//                    $('input.token-input').tokenInput(
//                        data,
//                        {
//                            theme:'facebook',
//                            hintText:"Type in a location",
//                            noResultsText: "No location is found.",
//                            tokenValue:'name',
//                            prePopulate: [{name: $scope.event.location }]
//                        }
//                    );
//                    $(".token-input-dropdown-facebook").css("z-index","9999");
//                });
            });
        }

        // open edit event intro popup
        $scope.OpenImagePopup = function(a){
            $scope.curPhoto = a;
            modal.open($scope,'/views/component/displayImagePopup.html',function(res){
            });
        }

//        // open write note Creator Popup
//        $scope.OpenWriteNoteCreator = function(){
//            modal.open($scope,'/views/component/writeNoteCreatorPopup.html',function(res){
//                console.log('open');
//            });
//        }
//
//        // open edit note Creator Popup
//        $scope.OpenEditNoteCreator = function(){
//            modal.open($scope,'/views/component/editNoteCreatorPopup.html',function(res){
//                console.log('open');
//            });
//        }

        // open view note Creator Popup
        $scope.OpenViewNoteCreator = function(){
            modal.open($scope,'/views/component/viewNoteCreatorPopup.html',function(res){
            });
        }

//        // open write note user Popup
//        $scope.OpenWriteNoteUser = function(){
//            modal.open($scope,'/views/component/writeNoteUserPopup.html',function(res){
//                console.log('open');
//            });
//        }

        // open view note Creator Popup
        $scope.OpenViewNoteUser = function(a,b){
            $scope.curTitle = a;
            $scope.curContent= b;
            modal.open($scope,'/views/component/viewNoteUserPopup.html',function(res){
            });
        }


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
                $scope.event.announcement=data;
                eventSocket.emit('newAnnouncement',{'postId':$routeParams.id});
            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    };

    // get event announcement
    $scope.getAnnouncement = function(){
        $http({
            method:'GET',
            url:'/api/getAnnouncement',
            params: {eventID: $routeParams.id},
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data){
                $scope.event.announcement=data;
            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    };

        // get event intro
        $scope.getEventIntro = function(){
            $http({
                method: 'GET',
                url:    '/api/getEventIntro',
                params: {eventID: $routeParams.id},
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data, status){
                    // update $scope
                    $scope.event.name = data.name;
                    $scope.event.location = data.location;
                    $scope.event.description = data.description;
                    var startTime = new Date(data.startTime);
                    $scope.event.startTime =formatFullDate(startTime);
                    if(data.endTime){
                        var endTime = new Date(data.endTime);
                        $scope.event.endTime=formatFullDate(endTime);
                    }
                    else $scope.event.endTime= "";
                    modal.close();

                })
                .error(function(err){
                    $scope.isUpdateError= true;
                    $scope.updateError= err;
                })
        };

    // edit creator's note
    $scope.editNoteCreator = function(a,b){
        $http({
            method: 'PUT',
            url:    '/api/updateNoteCreator',
            data: $.param({eventId: $routeParams.id,title: a, content: b}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                if(a==''&& b==''){
                    $scope.isCreatorNote = false;
                }
                $scope.event.creator.note.content = data.content;
                $scope.event.creator.note.title = data.title;
                $('#edit'+$scope.event.creator.userID).modal('toggle');
                //modal.close();

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    }
    // create creator's note
    $scope.createNoteCreator = function(a,b){
        $scope.isCreatorNote = true;
        $http({
            method: 'PUT',
            url:    '/api/updateNoteCreator',
            data: $.param({eventId: $routeParams.id,title: a, content: b}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $scope.isCreatorNote = true;
                $scope.event.creator.note.content = data.content;
                $scope.event.creator.note.title = data.title;
                console.log("IsCreatorNote :"+$scope.isCreatorNote);
                //modal.close();
                $('#write'+$scope.event.creator.userID).modal('toggle');


            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    }

    // create user's note
    $scope.editNoteUser = function(a,b){
        $http({
            method: 'PUT',
            url:    '/api/updateNoteUser',
            data: $.param({eventId: $routeParams.id,title: a, content: b}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                if(a == '' && b == ''){
                    $scope.isNoted = false;
                }
                $('#edit'+$scope.global.userId).modal('toggle');

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    }
    // create user's note
    $scope.createNoteUser = function(a,b){
        $http({
            method: 'PUT',
            url:    '/api/updateNoteUser',
            data: $.param({eventId: $routeParams.id,title: a, content: b}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $('#write'+$scope.global.userId).modal('toggle');
                //modal.close();
                $scope.isNoted = true;

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    }


    /**
     * TrungNM - Upload Multiple File
     * ThuanNH
     */
     $scope.openFileDialog = function(){
        $('#event-photo-input').trigger('click');
     }

    var multipleFile = $scope.uploader = $fileUploader.create({
        scope: $scope,                          // to automatically update the html. Default: $rootScope
        url: '/api/users/multipleFileUpload',
        formData: [
            { eventID: $routeParams.id}
        ],
        filters: [
            function (items) {
                return true;
            }
        ]
    });
        multipleFile.bind('complete', function (event, xhr, item, response) {
//            console.info('Complete', xhr, item, response);
            $timeout(function(){
                // find item from uploader queue
                for(var i =0;i<$scope.uploader.queue;i++){
                    if($scope.uploader.queue[i].$$hashKey === item.$$hashKey){
                        var index = i;
                    }
                }
                // remove
                $scope.uploader.queue.splice(index,1);
                // check if finish all
//                $("#event-photo-input").replaceWith($("#event-photo-input").clone());
            },2000);
        });
        multipleFile.bind('completeall', function (event, xhr, item, response) {
//            console.info('Complete', xhr, item, response);
            Event.get({
                id: $routeParams.id
            }, function(event) {
                $scope.event = event;
                $scope.startTime =event.startTime;
                $scope.endTime = event.endTime;
            });
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
            $scope.event = event;
            $scope.startTime =event.startTime;
            $scope.endTime = event.endTime;
        });

        // Get User information
        Users.getProfile({
            id: $scope.global.userId
        }, function (user) {
            $scope.user = user;
        });
    };

    // Thêm Comment
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
angular.module('my9time.event').controller('coverEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http','$translate', '$fileUploader', 'Users', '$timeout', '$route' ,'Modal', function($scope , $location ,Session, Event, $routeParams, Helper, $http,$translate, $fileUploader, Users, $timeout, $route, modal){
    $scope.tmpCords = '';
    // Tìm EventDetail
    $scope.findOne = function() {
//            Get event information
        Event.get({
            id: $routeParams.id
        }, function(event) {
            $scope.event = event;
            $scope.startTime =event.startTime;
            $scope.endTime = event.endTime;
        });

        // Get User information
        Users.getProfile({
            id: $scope.global.userId
        }, function (user) {
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
        $timeout(function(){$route.reload();},1000);
//        modal.open($scope,'/views/component/cropCoverModal.html',function(res){
//        });
    });

    /**
     * TrungNM - Crop cover
     */
    $scope.selected = function () {
        console.log($scope.event.cover);
        Event.cropCover({id: $routeParams.id}, {selected: $scope.tmpCords, cover: $scope.event.cover }, function (err) {
            $('#crop-cover-modal').modal('toggle');
            $timeout(function(){$route.reload();},1000);
        })

    };


    /**
     * TrungNM - Upload Cover
     */
    $scope.uploadCover = function () {
        $('#upload-cover').click();
    }



}]);



