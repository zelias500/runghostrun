app.controller('FriendsCtrl', function ($scope,allUser,$state) {
   $scope.allusers = allUser;
   $scope.goFriendPage = function(fdid){
      $state.go('tab.friend.profile', {id: fdid})
   }



});