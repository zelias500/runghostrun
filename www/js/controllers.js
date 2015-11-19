angular.module('starter.controllers', [])

// .controller('ProfileCtrl', function($scope) {})

// .controller('RecordCtrl', function($scope, Chats) {
//   // With the new view caching in Ionic, Controllers are only called
//   // when they are recreated or on app start, instead of every page change.
//   // To listen for when this page is active (for example, to refresh data),
//   // listen for the $ionicView.enter event:
//   //
//   //$scope.$on('$ionicView.enter', function(e) {
//   //});

//   $scope.chats = Chats.all();
//   $scope.remove = function(chat) {
//     Chats.remove(chat);
//   };
// })

.controller('HomeCtrl', function ($scope) {
  $scope.something = "Hello we are in Home!"
})

.controller('ProfileCtrl', function ($scope) {
  $scope.something = "Hello we are in Profile!"
})

.controller('RecordCtrl', function ($scope) {
  $scope.something = "Hello we are in Record!"
})

.controller('ChallengeCtrl', function ($scope) {
  $scope.something = "Hello we are in Challenge!"
})

.controller('MoreCtrl', function ($scope) {
  $scope.something = "Hello we are in More!"
});