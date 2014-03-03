/**
 * Created by motconvit on 3/3/14.
 */
angular.module('my9time.user')
    .controller('todolistController', ['$rootScope', '$location', '$scope', '$http', 'UserSession', 'Users', function ($rootScope, $location, $scope, $http, Session, Users) {
        $scope.global = Session;
        $scope.todos = '';
        var todos = $scope.todos;

        $scope.viewProfile = function () {
            Users.getProfile({
                id: $scope.global.userId
            }, function (user) {
                //TODO: coi lại cách hiển thị ( Fullname, birthday ... )
                $scope.todos = user.todoList;

            });
        };

//    $scope.$watch('todos', function (newValue, oldValue) {
//        $scope.remainingCount = filterFilter(todos, { completed: false }).length;
//        $scope.completedCount = todos.length - $scope.remainingCount;
//        $scope.allChecked = !$scope.remainingCount;
//        if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
//            todoStorage.put(todos);
//        }
//    }, true);

        $scope.addTodo = function() {
            $scope.todos.push({content:$scope.content, done:false});
            Users.addTodo({},{content: $scope.content}, function (user) {
                $location.path('profile');
            });
            $scope.content = '';
//        var user = $scope.user;

        };

        $scope.removeTodo = function (todo) {
            $scope.todos.splice($scope.todos.indexOf(todo), 1);
            Users.removeTodo({},{todo: todo}, function (user) {
//            $location.path('profile');
            });
        };

        $scope.changeStatusTodo = function(todo){
            Users.changeStatusTodo({},{todo: todo}, function (user) {
//            $location.path('profile');
            });
        }

        $scope.remaining = function() {
            var count = 0;
            angular.forEach($scope.todos, function(todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        };

        $scope.archive = function() {
            var oldTodos = $scope.todos;
            $scope.todos = [];
            angular.forEach(oldTodos, function(todo) {
                if (!todo.done) $scope.todos.push(todo);
            });
            Users.removeTodo({},{todo: todo}, function (user) {
//            $location.path('profile');
            });
        };
    }]);