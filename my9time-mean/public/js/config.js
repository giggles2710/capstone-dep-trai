'use strict';

//Setting up route
angular.module('my9time').config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider.
            when('/', {
                templateUrl: 'views/index.html',
                title: 'Welcome',
                strict:{
                    isPublic: false
                }
            }).
            when('/homepage', {
                templateUrl: 'views/homepage/homepage.html',
                title: 'Homepage',
                strict:{
                    isPublic: false
                }
            }).
            when('/timeshelf/:userId', {
                templateUrl: '/views/homepage/timeshelf.html',
                title: 'Timeshelf',
                strict:{
                    isPublic: false
                }
            }).
            when('/todolist', {
                templateUrl: 'views/todolist/create.html',
                title: 'Create todolist',
                strict:{
                    isPublic: true
                }
            }).
            when('/login', {
                templateUrl: 'views/users/signin.html',
                title: 'Log In',
                strict:{
                    isPublic: true
                }
            }).
            when('/signup', {
                templateUrl: 'views/users/signup.html',
                title: 'Sign Up',
                strict:{
                    isPublic: true
                }
            }).
            when('/logout', {
                strict:{
                    isPublic: false
                }
            }).
            when('/auth/google', {
                strict:{
                    isPublic: true
                }
            }).
            when('/auth/facebook', {
                strict:{
                    isPublic: true
                }
            }).
            when('/recovery',{
                templateUrl: 'views/users/recovery.html',
                strict:{
                    isPublic: true
                }
            }).
            when('/passwordrecover/:token',{
                templateUrl: '/views/users/passwordRecover.html',
                strict:{
                    isPublic: true
                }
            }).
            when('/event/create',{
                templateUrl:'/views/events/create.html',
                strict:{
                    isPublic: true
                },
                controller : 'createEventController'
            }).
            when('/event/view/:id',{
                templateUrl:'/views/events/view.html',
                strict:{
                    isPublic: true
                },
                controller : 'viewEventController'
            }).
            //TrungNM
            when('/event/view/:id/comment',{
                templateUrl:'/views/component/comment.html',
                strict:{
                    isPublic: true
                },
                controller : 'commentController'
            }).
            when('/event/edit',{
                templateUrl:'/views/events/edit.html',
                strict:{
                    isPublic: true
                },
                controller : 'viewEventController'
            }).
            when('/event/uploadImage',{
                templateUrl:'/views/events/uploadImage.html',
                strict:{
                    isPublic: true
                },
                controller : 'viewEventController'
            }).
            when('/404', {
                templateUrl: 'views/404.html',
                title: '404 - Page Not Found',
                strict:{
                    isPublic: true
                }
            }).
            when('/calendar', {
                templateUrl: 'views/test-calendar.html',
                title: 'Calendar',
                strict:{
                    isPublic: true
                },
                controller:'CalendarController'
            }).
            when('/users/viewall', {
                templateUrl: '/views/users/viewall.html',
                title: 'View ALl User',
                strict:{
                    isPublic: true
                },
                controller: 'viewAllUserController'
            }).
            when('/groups', {
                templateUrl: '/views/groups/viewall.html',
                title: 'View ALl Groups',
                strict:{
                    isPublic: true
                },
                controller: 'groupController'
            }).
            when('/groups/create', {
                templateUrl: '/views/groups/create.html',
                title: 'Create group',
                strict:{
                    isPublic: true
                },
                controller: 'groupController'
            }).
            when('/groups/:id', {
                templateUrl: '/views/groups/detail.html',
                title: 'Detail of Group',
                strict:{
                    isPublic: true
                },
                controller: 'groupController'
            }).
            // TrungNM: View User Profile
            when('/profile', {
                templateUrl: '/views/users/profile.html',
                title: 'View User Profile',
                strict:{
                    isPublic: true
                }
            }).
            // TrungNM: Upload Avatar
            when('/users/avatar', {
                templateUrl: '/views/users/avatar.html',
                title: 'Upload User Avatar',
                strict:{
                    isPublic: true
                },
                controller: 'userController'
            }).
            // TrungNM: Update Profile
            when('/users/edit', {
                templateUrl: '/views/users/edit.html',
                title: 'Update User Profile',
                strict:{
                    isPublic: true
                },
                controller: 'userController'
            }).
            // TrungNM: Update Profile
            when('/avatarcrop', {
                templateUrl: '/views/component/testCrop2.html',
                title: 'Update User Profile',
                strict:{
                    isPublic: true
                },
                controller: 'userController'
            }).
            when('/multipleFileUpload', {
                templateUrl: '/views/component/multipleFileUpload.html',
                title: 'Inbox',
                strict:{
                    isPublic: true
                },
                controller: 'userController'
            }).
            when('/messages', {
                templateUrl: '/views/messages/all.html',
                title: 'Inbox',
                strict:{
                    isPublic: true
                }
            }).
            otherwise({
                redirectTo: '/404'
            });
    }
]);

//====================================================================================================
// NghiaNV - 5/3/2014
// Multiple Languages

// Khóa Tiếng Anh
var enTranslations = {
    'TITLE': 'Hello Young buffaloes !',
    'FOO' : 'What is up !',
    //Keys of Event
    'CREATE_EVENT' : 'Create New Event',
    'VIEW_EVENT' : ' Event',
    'EVENT_NAME' : 'Name of Event',
    'ERROR_NAME_NULL' : 'Please input name of event',
    'ERROR_NAME_UNIQUE' : ' Someone has used this name, please try another',
    'START_TIME' : 'Start Time',
    'ERROR_START_NULL' : 'Please input startDate',
    'ERROR_START_INVALID' : 'Invalid startDate',
    'END_TIME' : 'End Time',
    'ERROR_END_INVALID' : 'endTime must be greater than startTime',
    'DATE' : 'Date',
    'MONTH' : 'Month',
    'YEAR' : 'Year',
    'HOUR' : 'Hour',
    'STEP' : 'Step',
    'MINUTE' : 'Minute',
    'LOCATION' : 'Location',
    'ERROR_LOCATION_NULL' : 'Please input location',
    'DESCRIPTION' : 'Description',
    'EVENT_PRIVACY' : 'Privacy',
    'PRIVACY' : 'Privacy',
    'GROUP' : 'Group',
    'OPEN_COMMUNITY' : 'Open Community',
    'CLOSE_COMMUNITY' : 'Close Community',
    'EVENT_INVITE' : 'Invite',
    'INVITE_RIGHT' : 'Invite Right',
    'COLOR' : 'Color',
    'COLOR_RED' : 'Red',
    'COLOR_GREEN' : 'Green',
    'COLOR_BLUE' : 'Blue',
    'COLOR_YELLOW' : 'Yellow',
    'COLOR_WHITE' : 'White',
    'ALARM' : 'Alarm',
    'EVENT_NOTE' : 'Note',
    'WRITE_NOTE' : 'Write note',
    'EDIT_NOTE' : 'Edit note',
    'CREATOR' : 'Creator',
    'ANNOUNCEMENT' : 'Announcement',
    'IMAGE' : 'Images',
    'COMMENT' : 'Comment',
    'WRITE_COMMENT' : 'Write comment',
    'RECENT_EVENT' : 'Recent events',
    'SEARCH' : 'Search',
    'RECENT_ADD' : 'Recently added',
    'TIME_HAPPEN' : 'Time of events',
    'RECIPIENT':'Recipients',
    'ERROR_RECIPIENT':'Please input your recipients',
    'MESSAGE':'Messages',
    'ERROR_MESSAGE':' Please input your message',
    'SEND_MESSAGE':'Send message',
    'BUTTON_CREATE' : 'Create',
    'BUTTON_UPDATE' : 'Update',
    'BUTTON_CANCEL' : 'Cancel',
    'BUTTON_EDIT' : 'Edit',
    'BUTTON_CREATE_EVENT' : 'Create Event',
    'BUTTON_ENGLISH' : 'English',
    'BUTTON_VIETNAMESE' : 'Vietnamese',
    'BUTTON_LOGOUT' : 'Log Out',
    'BUTTON_LOGIN' : 'Log In',
    'BUTTON_HOME' : 'Home',
    'BUTTON_MESSAGE' : 'Message',
    'BUTTON_MYTIMESHELF' : 'My Timeshelf',
    'BUTTON_CALENDAR' : 'Event Calendar',
    'BUTTON_SEND' : 'Send',
    'BUTTON_CLOSE' : 'Close',

    // TrungNM
    // Profile page
    'CROP_WELCOME' : 'Wellcome to Crop Crop Crop',
    'JOIN_DATE' : 'Join date',
    'ADD_FRIEND' : 'Add Friend',
    "VIEW_PROFILE" : "View {{user.local.username}}'s profile",
    'SEND_MESSAGES' : 'Send {{user.local.username}} messages',
    'INFOMATION' : 'Information',
    'FRIENDS' : 'Friends',
    'EVENT' : 'Event',
    'BASIC_INFOMATION' : 'Basic Information',
    'EMAIL' : 'Email',
    'BIRTHDAY' : 'Birthday',
    'GENDER' : 'Gender',
    'LANGUAGE' : 'Language',
    'ABOUT' : 'About',
    'WORK' : 'Work'


};
// Khóa Tiếng Việt
var viTranslations = {
    'TITLE': 'Chào các bạn trẻ trâu !',
    'FOO' : 'Khỏe hem !',
    // Khóa của Event
    'CREATE_EVENT' : 'Tạo Sự Kiện',
    'VIEW_EVENT' : ' Sự Kiện',
    'EVENT_NAME' : 'Tên Sự Kiện',
    'ERROR_NAME_NULL' : 'Bạn chưa nhập tên sự kiện',
    'ERROR_NAME_UNIQUE' : 'Tên này đã được sử dụng',
    'START_TIME' : 'Bắt Đầu Lúc',
    'ERROR_START_NULL' : 'Bạn chưa nhập ngày bắt đầu',
    'ERROR_START_INVALID' : 'Ngày bắt đầu sai. Sự kiện này chưa xảy ra mà !',
    'END_TIME' : 'Kết Thúc Lúc',
    'ERROR_END_INVALID' : 'thời gian kết thúc phải lơn hơn thời gian bắt đầu',
    'DATE' : 'Ngày',
    'MONTH' : 'Tháng',
    'YEAR' : 'Năm',
    'HOUR' : 'Giờ',
    'STEP' : 'Múi',
    'MINUTE' : 'Phút',
    'LOCATION' : 'Địa Điểm',
    'ERROR_LOCATION_NULL' : 'Bạn chưa nhập địa điểm',
    'DESCRIPTION' : 'Mô tả',
    'EVENT_PRIVACY' : 'Loại Sự Kiện',
    'PRIVACY' : 'Cá Nhân',
    'GROUP' : 'Nhóm',
    'OPEN_COMMUNITY' : 'Cộng Đồng Mở',
    'CLOSE_COMMUNITY' : 'Cộng Đồng Đóng',
    'EVENT_INVITE' : 'Quyền Tham Gia',
    'INVITE_RIGHT' : 'Quyền mời',
    'COLOR' : 'Màu viền',
    'COLOR_RED' : 'Đỏ',
    'COLOR_GREEN' : 'Xanh Lục',
    'COLOR_BLUE' : 'Xanh da trời',
    'COLOR_YELLOW' : 'Vàng',
    'COLOR_WHITE' : 'Trắng',
    'ALARM' : 'Nhắc Nhở',
    'EVENT_NOTE' : 'Lưu Bút',
    'WRITE_NOTE' : 'Viết lưu bút',
    'EDIT_NOTE' : 'Sửa lưu bút',
    'CREATOR' : 'Chủ Xị',
    'ANNOUNCEMENT' : 'Thông Báo',
    'IMAGE' : 'Hình Ảnh',
    'COMMENT' : 'Bình Luận',
    'WRITE_COMMENT' : 'Bình Luận',
    'RECENT_EVENT' : 'Sự kiện gần đây',
    'SEARCH' : 'Tìm kiếm',
    'RECENT_ADD' : 'Thời gian tạo',
    'TIME_HAPPEN' : 'Thời gian sảy ra',
    'RECIPIENT':'Người nhận',
    'ERROR_RECIPIENT':'Bạn chưa nhập tên người nhận',
    'MESSAGE':'Tin nhắn',
    'ERROR_MESSAGE':'Bạn chưa nhập nội dung tin nhắn',
    'SEND_MESSAGE':'Gửi tin nhắn',
    'BUTTON_CREATE' : 'Tạo',
    'BUTTON_UPDATE' : 'Lưu',
    'BUTTON_CANCEL' : 'Hủy',
    'BUTTON_EDIT' : 'Sửa',
    'BUTTON_CREATE_EVENT' : 'Tạo',
    'BUTTON_ENGLISH' : 'Tiếng Anh',
    'BUTTON_VIETNAMESE' : 'Tiếng Việt',
    'BUTTON_LOGOUT' : 'Đăng Xuất',
    'BUTTON_LOGIN' : 'Đăng Nhập',
    'BUTTON_HOME' : 'Trang chủ',
    'BUTTON_MESSAGE' : 'Tin nhắn',
    'BUTTON_MYTIMESHELF' : 'Trang cá nhân',
    'BUTTON_CALENDAR' : 'Lịch sự kiện',
    'BUTTON_SEND' : 'Gửi',
    'BUTTON_CLOSE' : 'Đóng',

    // TrungNM
    'CROP_WELCOME' : 'Xin chào đến với Crop Crop',
    'JOIN_DATE' : 'Ngày tham gia',
    'ADD_FRIEND' : 'Thêm bạn',
    "VIEW_PROFILE" : "Xem thông tin",
    'SEND_MESSAGES' : 'Gửi tin nhắn cho {{user.local.username}}',
    'INFOMATION' : 'Thông tin',
    'FRIENDS' : 'Bạn bè',
    'EVENT' : 'Sự kiện',
    'BASIC_INFOMATION' : 'Thông tin cơ bản',
    'EMAIL' : 'Email',
    'BIRTHDAY' : 'Ngày sinh',
    'GENDER' : 'Giới tính',
    'LANGUAGE' : 'Ngôn ngữ',
    'ABOUT' : 'Thông tin bản thân',
    'WORK' : 'Công việc'





};

angular.module('my9time').config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', enTranslations);

    $translateProvider.translations('vi',viTranslations );

    // set default language
    $translateProvider.preferredLanguage('vi');

//    // Tell the module to store the language in the cookies
    $translateProvider.useCookieStorage();

    // Tell the module to use a key 'lang' in the storage instead of default key
    $translateProvider.storageKey('lang');
}]);



//=====================================================================================================================

angular.module('my9time').run(['$rootScope',function($rootScope){
    $rootScope.isLogged = false;
}]);

angular.module('my9time').run(['$rootScope','$location','$http','UserSession', function($root,$location,$http,Session){
    $root.$on('$routeChangeStart',function(event, currRoute, prevRoute){
        // in the first time load page, check session
        // if session is logged, check status of this user
        // return:
        // - if session is none
        // - if user is unavailable, alert
        // =============================================================================================================
        // process layout
        $root.main = false;
        if(currRoute.layout){
            if(currRoute.layout == 'main'){
                $root.main = true;
            }
        }
        // =============================================================================================================
        // processing route
        // first time load the app, so go check cur session
        $http({method:'get',url:'/api/checkSession/'})
            .success(function(data, status){
                // update Session service
                if(data){
                    Session.userId = data.id;
                    Session.username = data.username;
                    Session.isLogged = true;
                    Session.fullName = data.fullName;
                    Session.avatar = data.avatar;
                }
                // check current route
            })
            .error(function(data, status){
                if(!currRoute.strict.isPublic){
                    $location.path('/login');
                }
            });
    });
}]);