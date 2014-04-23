/**
 * Created by MinhTN on 3/3/14.
 */
angular.module('my9time.user')
    .controller('todolistController', ['$rootScope', '$location', '$scope', '$http', 'UserSession', 'Users', function ($rootScope, $location, $scope, $http, Session, Users) {
        $scope.global = Session;
        $scope.todos = '';

        $scope.getTodo = function(){
          Users.getTodo({id: $scope.global.userId}, function(user){
              $scope.todos = user.todoList;
          });
        };

        $scope.addTodo = function() {
            Users.addTodo({},{content: $scope.content}, function (user) {
                $scope.todos.push({_id:user.idTodo, content: user.content, status:false});
            });
            $scope.content = '';
        };

        $scope.removeTodo = function (todo) {
            $scope.todos.splice($scope.todos.indexOf(todo), 1);
            Users.removeTodo({},{todo: todo}, function (user) {
            });
        };

        $scope.changeStatusTodo = function(todo){
            Users.changeStatusTodo({},{todo: todo}, function (user) {
            });
        }

        $scope.remaining = function() {
            var count = 0;
            angular.forEach($scope.todos, function(todo) {
                count += todo.status ? 0 : 1;
            });
            return count;
        };

        $scope.archive = function() {
            var oldTodos = $scope.todos;
            $scope.todos = [];
            angular.forEach(oldTodos, function(todo) {
                if (!todo.status) {
                    $scope.todos.push(todo);
                }else Users.removeTodo({},{todo: todo}, function (user) {
                });


            });

        };
    }]);