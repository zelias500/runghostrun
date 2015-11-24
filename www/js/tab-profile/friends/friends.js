app.controller('FriendsCtrl', function ($scope,allUser,$state) {
   $scope.allusers = allUser;
   $scope.goFriendPage = function(id){
      $state.go('tab.profile', {id: id})
   }

});