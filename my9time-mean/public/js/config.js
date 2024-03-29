'use strict';

//Setting up route
angular.module('my9time').config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider.
            when('/', {
                templateUrl: 'views/homepage/homepage.html',
                title: 'Homepage',
                resolve: resolver(true)
            }).
            when('/admin/home',{
                templateUrl: '/views/admins/home.html',
                title: 'Admin -- Home',
                resolve: resolver(true,true)
            }).
            when('/admin/user/:id',{
                templateUrl: '/views/admins/user.html',
                title: 'Admin -- User',
                resolve: resolver(true,true)
            }).
            when('/admin/event/:id',{
                templateUrl: '/views/admins/event.html',
                title: 'Admin -- User',
                resolve: resolver(true,true)
            }).
            when('/timeshelf/:userId', {
                templateUrl: '/views/homepage/timeshelf.html',
                title: 'Timeshelf',
                resolve: resolver(true)
            }).
            when('/todolist', {
                templateUrl: 'views/todolist/create.html',
                title: 'Create todolist',
                resolve: resolver(false)
            }).
            when('/login', {
                templateUrl: 'views/users/signin.html',
                title: 'Log In',
                resolve: resolver(false)
            }).
            when('/signup', {
                templateUrl: 'views/users/signup.html',
                title: 'Sign Up',
                resolve: resolver(false)
            }).
            when('/logout', {
                resolve: resolver(true)
            }).
            when('/auth/google', {
                resolve: resolver(false)
            }).
            when('/auth/facebook', {
                resolve: resolver(false)
            }).
            when('/recovery',{
                templateUrl: 'views/users/recovery.html',
                resolve: resolver(false)
            }).
            when('/passwordrecover/:token',{
                templateUrl: '/views/users/passwordRecover.html',
                resolve: resolver(false)
            }).
            when('/event/create',{
                templateUrl:'/views/events/create.html',
                resolve: resolver(false),
                controller : 'createEventController'
            }).
            when('/aboutUs',{
                templateUrl:'/views/component/about.html',
                resolve: resolver(false)
            }).
            when('/event/view/:id',{
                templateUrl:'/views/events/view.html',
                resolve: resolver(true)
            }).
            //TrungNM
            when('/event/view/:id/comment',{
                templateUrl:'/views/component/comment.html',
                resolve: resolver(false),
                controller : 'commentController'
            }).
            when('/event/edit',{
                templateUrl:'/views/events/edit.html',
                resolve: resolver(false)
            }).
            when('/event/uploadImage',{
                templateUrl:'/views/events/uploadImage.html',
                resolve: resolver(false),
                controller : 'viewEventController'
            }).
            when('/404', {
                templateUrl: 'views/404.html',
                title: '404 - Page Not Found',
                resolve: resolver(false)
            }).
            when('/calendar', {
                templateUrl: 'views/calendar/calendar.html',
                title: 'Calendar',
                resolve: resolver(true),
                controller:'CalendarController'
            }).
            when('/users/viewall', {
                templateUrl: '/views/users/viewall.html',
                title: 'View ALl User',
                resolve: resolver(false),
                controller: 'viewAllUserController'
            }).
//            when('/groups', {
//                templateUrl: '/views/groups/viewall.html',
//                title: 'View ALl Groups',
//                resolve: resolver(false),
//                controller: 'groupController'
//            }).
//            when('/groups/create', {
//                templateUrl: '/views/groups/create.html',
//                title: 'Create group',
//                resolve: resolver(false),
//                controller: 'groupController'
//            }).
//            when('/groups/:id', {
//                templateUrl: '/views/groups/detail.html',
//                title: 'Detail of Group',
//                resolve: resolver(false),
//                controller: 'groupController'
//            }).
            // TrungNM: View User Profile
            when('/profile/:id', {
                templateUrl: '/views/users/profile.html',
                title: 'View User Profile',
                resolve: resolver(true)
            }).
//            when('/profile/:id/:friendList', {
//                templateUrl: '/views/users/profile.html',
//                title: 'View User Profile',
//                resolve: resolver(true)
//            }).
            // TrungNM: Upload Avatar
            when('/users/avatar', {
                templateUrl: '/views/users/avatar.html',
                title: 'Upload User Avatar',
                resolve: resolver(false),
                controller: 'userController'
            }).
            // TrungNM: Update Profile
            when('/users/edit', {
                templateUrl: '/views/users/edit.html',
                title: 'Update User Profile',
                resolve: resolver(false),
                controller: 'userController'
            }).
            // TrungNM: Update Profile
            when('/avatarcrop', {
                templateUrl: '/views/component/testCrop2.html',
                title: 'Update User Profile',
                resolve: resolver(false),
                controller: 'userController'
            }).
            when('/multipleFileUpload', {
                templateUrl: '/views/component/multipleFileUpload.html',
                title: 'Inbox',
                resolve: resolver(false),
                controller: 'userController'
            }).
            when('/messages', {
                templateUrl: '/views/messages/all.html',
                title: 'Inbox',
                resolve: resolver(true)
            }).
            when('/termandcondition', {
                templateUrl: '/views/component/termAndCondition.html',
                title: 'Term and Condition',
                resolve: resolver(false)
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
    'TITLE': 'Hello Young buffalo {{a}} !',
    'FOO' : 'What is up !',
    //Keys of Event
    'CREATE_EVENT' : 'Create New Event',
    'VIEW_EVENT' : ' Event',
    'UPDATE_EVENT_INTRO' : ' Edit Event Intro',
    'EVENT_NAME' : 'Name of event',
    'ERROR_NAME_NULL' : 'Please input name of event',
    'ERROR_NAME_UNIQUE' : ' Someone has used this name, please try another',
    'START_TIME' : 'Start time',
    'START_DATE' : 'Start date',
    'ERROR_START_NULL' : 'Please input startDate',
    'ERROR_START_INVALID' : 'Invalid startDate',
    'END_TIME' : 'End time',
    'END_DATE' : 'End date',
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
    'DESCRIPTION_NULL' : 'Not yet',
    'EVENT_PRIVACY' : 'Privacy',
    'PRIVACY' : 'Private',
    'GROUP' : 'Group',
    'OPEN_COMMUNITY' : 'Open Community',
    'CLOSE_COMMUNITY' : 'Close Community',
    'EVENT_INVITE' : 'Invite',
    'INVITE_RIGHT' : 'Invite right',
    'COLOR' : 'Color',
    'COLOR_RED' : 'Red',
    'COLOR_GREEN' : 'Green',
    'COLOR_BLUE' : 'Blue',
    'COLOR_YELLOW' : 'Yellow',
    'COLOR_WHITE' : 'White',
    'ALARM' : 'Alarm',
    'EVENT_NOTE' : 'Note',
    'WRITE_NOTE' : 'Write note...',
    'EDIT_NOTE' : 'Edit note ',
    'NOTE_TITLE':'Title',
    'NOTE_CONTENT':'Content',
    'CREATOR' : 'Creator',
    'ANNOUNCEMENT' : 'Announcement',
    'ANNOUNCEMENT_WRITE': 'Write Annoutcement',
    'IMAGE' : 'Images',
    'COMMENT' : 'Comment',
    'WRITE_COMMENT' : 'Write comment...',
    'RECENT_EVENT' : 'Recent events',
    'SEARCH' : 'Search',
    'RECENT_ADD' : 'Recently added',
    'TIME_HAPPEN' : 'Time of events',
    'RECIPIENT':'Recipients',
    'ERROR_RECIPIENT':'Please input your recipients',
    'MESSAGE':'Messages',
    'ERROR_MESSAGE':' Please input your message',
    'SEND_MESSAGE':'Send message',
    'LIKE' :'Like',
    'LIKES' :'Likes',
    'MEMBER' :'Member',
    'MEMBERS' :'Members',
    'DAY' :'Day',
    'WEEK' :'Week',
    'MONTHS' :'Month',
    'HIGHLIGHT' :'Highlight',
    'PEOPLE':'people',
    'TIMESHELF':'Timeshelf',
    'REMAINING' : 'Remaining',
    'PARTICIPANT':'Participants',
    'CLEAN': 'Clean',
    'ADD' : 'Add',
    'ADD_TODO' : 'Add new todo...',
    'DELETE' : 'Delete',
    'BUTTON_CREATE' : 'Create',
    'BUTTON_UPDATE' : 'Update',
    'BUTTON_UPLOAD' : 'Upload',
    'BUTTON_CANCEL' : 'Cancel',
    'BUTTON_EDIT' : 'Edit',
    'BUTTON_SAVE' : 'Save',
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
    'BUTTON_HIDE' : 'Hide',
    'BUTTON_CONFIRM' : 'Confirm',
    'CONFIRM':"Do you really want to hide this event ?",
    'ERROR_NULL_TITLE' : 'Please enter title',
    'ERROR_NULL_CONTENT': 'Please enter content',
    'STATISTIC':'Statistic',
    'ADD_FILE':'Add File',
    'UPLOAD_ALL' : 'Upload all',
    'CANCEL_ALL' : 'Cancel all',
    'REMOVE_ALL' : 'Remove all',
    'NAME' : 'Name',
    'SIZE':'Size',
    'PROGRESS':'Progress',
    'ACTION':'Actions',
    'REMOVE':'Remove',
    'CANCEL':'Cancel',


    // LoginPage
    'LOGIN_EMAIL': 'Your username or email',
    'USERNAME_EMAIL':'myusername or mymail@mail.com',
    'LOGIN_PASS':'Your password',
    'FORGOT_PASS':'Forgot password',
    'NOT_MEMBER':'Not a member yet ?',
    'REGISTER':'Register',
    'ERROR_USERNAME':'Please input your username',
    'ERROR_EMAIL':'Please input your email',
    'ERROR_PASS':'Please input your password',
    'ERROR_PASS_1':'Your password must have more than 6 characters',
    'ERROR_PASS_2':'Your password does not match',
    'SEND_EMAIL':'We have sent information about new password via your email address.',
    'CHECK_INBOX':'Check your inbox',
    'NEXT_STEP':'to see the next step',
    'YOUR_USERNAME':'Your username',
    'YOUR_EMAIL':'Your email',
    'INVALID_EMAIL':'Invalid email format',
    'INVALID_DATE':'Invalid date',
    'WANNA_LOGIN':'Wanna login',
    'OPEN_TIMESHELF':'Open your timeshelf with ',
    'NOW':'now!',
    'RESET_PASS':'Reset Password',
    'USERNAME': 'Username',
    'CREATE_TIMESHELF':'Create Timeshelf',
    'ERROR_SERVER_1':'Something wrong just happened. Please try again.',
    'ERROR_SERVER_2':'Incorrect captcha. Please try again.',
    'ERROR_SERVER_3':'Your process is timeout. Please try again.',
    'ERROR_FIRST_NAME':'Please input your first name',
    'ERROR_LAST_NAME':'Please input your last name',
    'ERROR_USERNAME_1':'Your username must have more than 6 characters',
    'ERROR_USERNAME_2':'Your username must have less than 10 characters',
    'ERROR_USERNAME_3':'Someone has used this username, please try another',
    'ERROR_USERNAME_4':"Username can not contain special characters excepts '_'",
    'ERROR_USED_EMAIL':'This email address has been used. If you forgot your account, recover it',
    'HERE':'here',
    'OR':'or just',
    'SIGN_IN':'sign in',
    'SIGN_UP':'Sign up',
    'PASSWORD':'Password',
    'MALE':'Male',
    'FEMALE':'Female',
    'TERM':'Term and Condition',
    'ALREADY_HAVE':'Already have your timeshelf ?',
    'GO_LOGIN':'Go and Log in',
    'CONFIRM_PASS':'Please confirm your password',
    'P_FIRST_NAME':'first name',
    'P_LAST_NAME':'last name',
    'P_USERNAME':'username1992',
    'P_EMAIL':'mymail@mail.com',


    // Profile page - TrungNM
    'CROP_WELCOME' : 'Wellcome to Crop Crop Crop',
    'JOIN_DATE' : 'Join date',
    'ADD_FRIEND' : 'Add Friend',
    'VIEW_PROFILE' : "View Profile",
    'SEND_MESSAGES' : 'Send Messages',
    'INFOMATION' : 'Information',
    'FRIENDS' : 'Friends',
    'EVENT' : 'Event',
    'BASIC_INFOMATION' : 'Basic Information',
    'EMAIL' : 'Email',
    'BIRTHDAY' : 'Birthday',
    'GENDER' : 'Gender',
    'LANGUAGE' : 'Language',
    'ABOUT' : 'About',
    'WORK' : 'Work',
    'FIRST_NAME' : 'First name',
    'LAST_NAME' : 'Last name',
    'OCCUPATION': 'Occupation',
    'WORKPLACE': 'Workplace',
    'STUDY_PLACE' : 'Study place',
    'DISPLAY' : 'Show birthday',
    'YES':'Yes',
    'NO':'No',
    'CHANGE-COVER': 'Click here to change cover image!',
    'CHANGE-PROFILE': 'Click here to change profile image',
    'NOTI_COMMENT': 'commented on your event',
    'NOTI_INTRO':' has edited',
    'NOTI_ANNOUN':'has announced in',
    'NOTI_NULL':'You have no notification',
    'NOTI_NULL_MESSAGE':'You have no message',
    'NOTI_NULL_FRIEND':'You have no friend request',
    'NOTI_LIKE':'liked',
    'NOTI_EVENT':'want to join event',
    'NOTI_NULL_EVENT':'You have no friend request',
    'NOTI_JOIN':'want to join',
    'NOTI_INVITE':'You have been invited to ',
    'NOTI_SEND':'has sent you a friend request.',
    'NOTI_FRIEND_CONFIRMED':' accepted you as a friend.',
    'SUGGEST_FRIEND':'Suggest friend'


};
// Khóa Tiếng Việt
var viTranslations = {
    'TITLE': 'Chào bạn trẻ trâu {{a}} !',
    'FOO' : 'Khỏe hem !',
    // Khóa của Event
    'CREATE_EVENT' : 'Tạo Sự Kiện',
    'VIEW_EVENT' : ' Sự Kiện',
    'UPDATE_EVENT_INTRO' : ' Sửa thông tin sự kiện',
    'EVENT_NAME' : 'Tên sự kiện',
    'ERROR_NAME_NULL' : 'Bạn chưa nhập tên sự kiện',
    'ERROR_NAME_UNIQUE' : 'Tên này đã được sử dụng',
    'START_TIME' : 'Giờ bắt đầu',
    'START_DATE' : 'Ngày bắt đầu',
    'ERROR_START_NULL' : 'Bạn chưa nhập ngày bắt đầu',
    'ERROR_START_INVALID' : 'Bạn đã nhập sai thời gian bắt đầu',
    'END_TIME' : 'Giờ kết thúc',
    'END_DATE' : 'Ngày kết thúc',
    'ERROR_END_INVALID' : 'Thời gian kết thúc phải lơn hơn thời gian bắt đầu',
    'DATE' : 'Ngày',
    'MONTH' : 'Tháng',
    'YEAR' : 'Năm',
    'HOUR' : 'Giờ',
    'STEP' : 'Múi',
    'MINUTE' : 'Phút',
    'LOCATION' : 'Địa chỉ',
    'ERROR_LOCATION_NULL' : 'Bạn chưa nhập địa điểm',
    'DESCRIPTION' : 'Mô tả',
    'DESCRIPTION_NULL' : 'Chưa có mô tả',
    'EVENT_PRIVACY' : 'Loại sự kiện',
    'PRIVACY' : 'Cá nhân',
    'GROUP' : 'Nhóm',
    'OPEN_COMMUNITY' : 'Cộng đồng mở',
    'CLOSE_COMMUNITY' : 'Cộng đồng đóng',
    'EVENT_INVITE' : 'Tham gia',
    'INVITE_RIGHT' : 'Quyền mời',
    'COLOR' : 'Màu viền',
    'COLOR_RED' : 'Đỏ',
    'COLOR_GREEN' : 'Xanh lục',
    'COLOR_BLUE' : 'Xanh da trời',
    'COLOR_YELLOW' : 'Vàng',
    'COLOR_WHITE' : 'Trắng',
    'ALARM' : 'Nhắc nhở',
    'EVENT_NOTE' : 'Lưu bút',
    'WRITE_NOTE' : 'Viết lưu bút...',
    'EDIT_NOTE' : 'Sửa lưu bút',
    'NOTE_TITLE':'Nhan đề',
    'NOTE_CONTENT':'Nội dung',
    'CREATOR' : 'Chủ xị',
    'ANNOUNCEMENT' : 'Thông Báo',
    'ANNOUNCEMENT_WRITE': 'Viết thông báo...',
    'IMAGE' : 'Hình Ảnh',
    'COMMENT' : 'Bình Luận',
    'WRITE_COMMENT' : 'Viết bình Luận...',
    'RECENT_EVENT' : 'Sự kiện gần đây',
    'SEARCH' : 'Tìm kiếm',
    'RECENT_ADD' : 'Thời gian tạo',
    'TIME_HAPPEN' : 'Thời gian xảy ra',
    'RECIPIENT':'Người nhận',
    'ERROR_RECIPIENT':'Bạn chưa nhập tên người nhận',
    'MESSAGE':'Tin nhắn',
    'ERROR_MESSAGE':'Bạn chưa nhập nội dung tin nhắn',
    'SEND_MESSAGE':'Gửi tin nhắn',
    'LIKE' :'Nghía',
    'LIKES' :'Nghía',
    'MEMBER' :'Thành viên',
    'MEMBERS' :'Thành viên',
    'DAY' :'Ngày',
    'WEEK' :'Tuần',
    'MONTHS' :'Tháng',
    'HIGHLIGHT' :'Nổi bật',
    'PARTICIPANT':'Tham gia',
    'CLEAN': 'Dọn',
    'ADD' : 'Thêm',
    'ADD_TODO' : 'Thêm nhắc nhở...',
    'DELETE' : 'Xóa',
    'PEOPLE':'người',
    'TIMESHELF':'Trang cá nhân ',
    'REMAINING' : 'Tiến độ',
    'BUTTON_CREATE' : 'Tạo',
    'BUTTON_UPDATE' : 'Lưu',
    'BUTTON_UPLOAD' : 'Lưu',
    'BUTTON_CANCEL' : 'Hủy',
    'BUTTON_EDIT' : 'Sửa',
    'BUTTON_SAVE' : 'Lưu',
    'BUTTON_CREATE_EVENT' : 'Tạo Sự Kiện',
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
    'BUTTON_HIDE' : 'Ẩn',
    'BUTTON_CONFIRM' : 'Đồng ý',
    'CONFIRM':"Bạn thực sự muốn ẩn sự kiện này ?",
    'ERROR_NULL_TITLE' : 'Bạn chưa viết tiêu đề',
    'ERROR_NULL_CONTENT': 'Bạn chưa viết nội dung',
    'STATISTIC':'Thống kê',
    'ADD_FILE':'Chọn File',
    'UPLOAD_ALL' : 'Lưu tất cả',
    'CANCEL_ALL' : 'Ngừng tất cả',
    'REMOVE_ALL' : 'Hủy tất cả',
    'NAME' : 'Tên',
    'SIZE':'Size',
    'PROGRESS':'Tiến trình',
    'ACTION':'Thao tác',
    'REMOVE':'Hủy',
    'CANCEL':'Đừng',

    // LoginPage
    'LOGIN_EMAIL': 'Tên đăng nhập hoặc email',
    'USERNAME_EMAIL':'hoten hoặc hoten@mail.com',
    'LOGIN_PASS':'Mật khẩu',
    'FORGOT_PASS':'Quên mật khẩu',
    'NOT_MEMBER':'Chưa có tài khoản ?',
    'REGISTER':'Đăng kí',
    'ERROR_USERNAME':'Bạn chưa điền tên đăng nhập',
    'ERROR_EMAIL':'Bạn chưa điền email',
    'ERROR_PASS':'Bạn chưa điền mật khẩu',
    'ERROR_PASS_1':'Mật khẩu phải dài hơn 6 kí tự',
    'ERROR_PASS_2':'Mật khẩu không khớp',
    'SEND_EMAIL':'Chúng tôi đã gửi thông tin về mật khẩu mới vào email của bạn',
    'CHECK_INBOX':'Kiểm tra hộp thư của bạn',
    'NEXT_STEP':'để biết bước tiếp theo',
    'YOUR_USERNAME':'Tên đăng nhập',
    'YOUR_EMAIL':'Email',
    'INVALID_EMAIL':'Email không hợp lệ',
    'INVALID_DATE':'Ngày không hợp lệ',
    'WANNA_LOGIN':'Đăng nhập',
    'OPEN_TIMESHELF':'Tạo cho mình kệ thời gian với',
    'NOW':'ngay!',
    'RESET_PASS':'Đổi mật khẩu',
    'USERNAME': 'Tên đăng nhập',
    'CREATE_TIMESHELF':'Tạo kệ thời gian',
    'ERROR_SERVER_1':'Có lỗi xảy ra. Vui lòng thử lại.',
    'ERROR_SERVER_2':'Sai mã bảo vệ. Vui lòng thử lại.',
    'ERROR_SERVER_3':'Thời gian chờ quá lâu. Vui lòng thử lại.',
    'ERROR_FIRST_NAME':'Bạn chưa nhập tên',
    'ERROR_LAST_NAME':'Bạn chưa nhập họ',
    'ERROR_USERNAME_1':'Tên đăng nhập phải dài hơn 5 kí tự',
    'ERROR_USERNAME_2':'Tên đăng nhập phải ngắn hơn 10 kí tự',
    'ERROR_USERNAME_3':'Tên đăng nhập này đã được sử dụng',
    'ERROR_USERNAME_4':"Tên đăng nhập không thể chứa kí hiệu đặc biệt trừ '_'",
    'ERROR_USED_EMAIL':'Email này đã được sử dụng. Bạn tên tài khoản ? khôi phục nó',
    'HERE':'tại đây',
    'OR':'hoặc',
    'SIGN_IN':'Đăng nhập',
    'SIGN_UP':'Đăng kí',
    'PASSWORD':'Mật khẩu',
    'MALE':'Nam',
    'FEMALE':'Nữ',
    'TERM':'Điều khoản sử dụng',
    'ALREADY_HAVE':'Đã có tài khoản ?',
    'GO_LOGIN':'Đăng nhập',
    'CONFIRM_PASS':'Xác nhận mật khẩu',
    'P_FIRST_NAME':'tên',
    'P_LAST_NAME':'họ',
    'P_USERNAME':'abc1990',
    'P_EMAIL':'email@mail.com',

    // Profile page - TrungNM
    'CROP_WELCOME' : 'Xin chào đến với Crop Crop',
    'JOIN_DATE' : 'Ngày tham gia',
    'ADD_FRIEND' : 'Thêm bạn',
    'VIEW_PROFILE' : "Xem Thông Tin",
    'SEND_MESSAGES' : 'Gửi tin nhắn ',
    'INFOMATION' : 'Thông tin',
    'FRIENDS' : 'Bạn bè',
    'EVENT' : 'Sự kiện',
    'BASIC_INFOMATION' : 'Thông tin cơ bản',
    'EMAIL' : 'Email',
    'BIRTHDAY' : 'Ngày sinh',
    'GENDER' : 'Giới tính',
    'LANGUAGE' : 'Ngôn ngữ',
    'ABOUT' : 'Tự tả',
    'WORK' : 'Công việc',
    'FIRST_NAME' : 'Tên',
    'LAST_NAME' : 'Họ',
    'OCCUPATION': 'Nghề Nghiệp',
    'WORKPLACE': 'Nơi làm việc',
    'STUDY_PLACE' : 'Nơi tốt nghiệp',
    'DISPLAY' : 'Hiện ngày sinh',
    'YES':'Có',
    'NO':'Không',
    'CHANGE-COVER': 'Click vào đây để thay đổi ảnh bìa!',
    'CHANGE-PROFILE': 'Click vào đây để thay đổi ảnh đại diện!',
    'NOTI_COMMENT': 'đã bình luận trong ',
    'NOTI_INTRO':' đã sửa thông tin',
    'NOTI_ANNOUN':'đã thông báo trong ',
    'NOTI_NULL':'Không có thông báo nào',
    'NOTI_NULL_MESSAGE':'Không có thông báo nào',
    'NOTI_NULL_FRIEND':'Không có thông báo nào',
    'NOTI_LIKE':'đã thích',
    'NOTI_EVENT':'đã tạo',
    'NOTI_NULL_EVENT':'Không có thông báo nào',
    'NOTI_JOIN':'muốn tham gia vào',
    'NOTI_INVITE':'Bạn đã được mời vào',
    'NOTI_SEND':'đã mời bạn kết bạn',
    'NOTI_FRIEND_CONFIRMED':'đã chấp nhận yêu cầu kết bạn của bạn',
    'SUGGEST_FRIEND':'Gợi ý kết bạn'



};

angular.module('my9time').config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', enTranslations);

    $translateProvider.translations('vi',viTranslations );

    // set default language
    $translateProvider.preferredLanguage('en');

//    // Tell the module to store the language in the cookies
    $translateProvider.useCookieStorage();

    // Tell the module to use a key 'lang' in the storage instead of default key
    $translateProvider.storageKey('lang');
}]);

//=====================================================================================================================

angular.module('my9time').run(['$rootScope',function($rootScope){
    $rootScope.isLogged = false;
}]);

// ==================================================================================
// resolver
var resolver = function(access,isAdmin){
    return{
        load: ['$q','$http','UserSession','$rootScope','$location','$window','Modal',function($q,$http,Session,$root,$location,$window,modal){
            // ========================================================================================================
            // processing route
            // first time load the app, so go check current session
            $http({method:'get',url:'/api/checkSession/'})
                .success(function(data, status){
                    // =================================================================================================
                    // update Session service
                    if(!data.isAdmin){
                        // is not admin
                        Session.userId = data.id;
                        Session.username = data.username;
                        Session.isLogged = true;
                        Session.fullName = data.fullName;
                        Session.avatar = data.avatar;
                        Session.isAdmin = false;
                    }else{
                        // is admin
                        Session.userId = data.id;
                        Session.username = data.username;
                        Session.isAdmin = true;
                    }
                    // =================================================================================================
                    // user who logged in when route to /login page will be redirected to / page
                    if($location.path().indexOf('/login') > -1 || $location.path().indexOf('/recovery') > -1){
                        var user = Session.userId;
                        if(user !== '' && !Session.isAdmin){
                            $window.location.href = '/';
                        }
                    }else{
                        // =================================================================================================
                        // only user can go to user page and only admin can go to admin page
                        if(!isAdmin){
                            // admin must not go to this page
                            // check if current user is the admin or not
                            if(Session.isAdmin){
                                // is admin, kick him back his page
                                $location.path('/admin/home');
                            }else{
                                // =================================================================================================
                                // show page
                                $root.isLoaded = true;

                                var deferred = $q.defer();
                                deferred.resolve();

                                return deferred.promise;
                            }
                        }else{
                            // user must not go to this page
                            // check if the current user is the user or not
                            if(!Session.isAdmin){
                                // is user, kick him back his page
                                $location.path('/404');
                            }else{
                                // =================================================================================================
                                // show page
                                $root.isLoaded = true;

                                var deferred = $q.defer();
                                deferred.resolve();

                                return deferred.promise;
                            }
                        }
                    }
                })
                .error(function(data, status){
                    // =================================================================================================
                    // user didn't log in
                    if(access){
                        // if user is banned, show him a modal to tell him that he is banned
                        if(data==='banned'){
                            // this page requires the authenticated user, he did not => so kick him back to login page
                            modal.open($root,'/views/component/userBannedModal.html',function(res){
                                $root.accept = function(){
                                    $window.location.href = '/login';
                                }
                            });
                        }else{
                            // this page requires the authenticated user, he did not => so kick him back to login page
                            $location.path('/login');
                            $root.isLoaded = true;
                        }
                    }else{
                        // this page is public, so let him go
                        $root.isLoaded = true;

                        var deferred = $q.defer();
                        deferred.resolve();

                        return deferred.promise;
                    }
                });
        }]
    }
}