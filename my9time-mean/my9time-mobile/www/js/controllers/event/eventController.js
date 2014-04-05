/**
 * Created by ConMeoMauDen on 19/03/2014.
 */

angular.module('my9time.event').controller('eventController', ['$scope' , '$rootScope','$stateParams', '$state', '$location','UserSession', 'Event', 'Helper','$http', function($scope , $rootScope, $stateParams, $state, $location ,Session, Event, Helper, $http){
    $scope.date = new Date();

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

    $scope.slidePage = function () {
//        $navigate.go(path,type);
        $state.go('eventDetail.comments');
    };

    $scope.gotoEventComments = function(){
        $state.go('eventDetail.comments');
    }

    $scope.gotoEventPhotos = function(){
        $state.go('eventDetail.photos');
    }

    $scope.gotoEventParticipants = function(){
        $state.go('eventDetail.participants');
    }

    $scope.back = function(){
        $state.back();
    }

    // get event
    $scope.findOne = function() {
        //TODO: checkCreator, checkParticipate
//        checkCreator();
//        checkParticipate();
        console.log('Event Controller - FindOne()' + $stateParams.eventId);
        Event.get({
            id: $stateParams.eventId
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
        var comment = {
            username: $scope.global.username,
            fullName: $scope.global.fullName,
            avatar: $scope.global.avatar,
            datetime: new Date(),
            content: $scope.inputComment
        }

        console.log('$stateParams :    ' + JSON.stringify($stateParams.id));
        // Làm việc với Server
        Event.addComment({id: $scope.event._id},{comment: comment}, function(event){
            // Sau khi Save vào database, server sẽ trả về 1 cái ID
            // Sử dụng các thứ có được ghi ra HTML
            console.log(event);
            $scope.event.comment.push({_id: event.idComment, username: $scope.global.username, content: comment.content, datetime: new Date()});

        })
        // Xóa trống chỗ nhập Comment, chuẩn bị cho comment tiếp theo
        $scope.inputComment = '';

    };



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




