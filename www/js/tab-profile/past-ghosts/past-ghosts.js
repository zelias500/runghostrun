app.config(function($stateProvider){
	$stateProvider.state('tab.pastghosts', {
        url: '/pastghosts',
        data:{
            authenticate: true
        },
        views: {
            'tab-profile': {
                templateUrl: 'js/tab-profile/past-ghosts/past-ghosts.html',
                controller: 'PastGhostsCtrl'
            }
        },
        resolve: {
            ghosts: function (UserFactory, Session) {
                return UserFactory.fetchAllGhosts(Session.user._id);
            }
        }
    });
});

app.controller('PastGhostsCtrl', function ($scope, $state, ghosts,$ionicModal,GhostFactory,UserFactory,Session) {

    $scope.ghosts = ghosts;
    $scope.editGhost = function(ghost){
      $scope.modal.show();
      $scope.selectGhost = ghost
    }
    $scope.edit = {privacy:'public'};

     $ionicModal.fromTemplateUrl('js/tab-profile/past-ghosts/edit-ghost.html', {
        scope: $scope,
        animation: 'slide-in-down'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.closeModal = function(){
        $scope.modal.hide();
    };

    $scope.updateGhost = function(edit){
        console.log(edit)
        GhostFactory.update($scope.selectGhost._id, edit)
        UserFactory.fetchAllGhosts(Session.user._id).then(function(update){
           $scope.ghosts = update;
        })
        $scope.modal.hide();
    }

    $scope.deleteGhost= function(){
       UserFactory.deleteGhost(Session.user._id,{ghostid:$scope.selectGhost._id})
       GhostFactory.delete($scope.selectGhost._id)
       UserFactory.fetchAllGhosts(Session.user._id).then(function(update){
           $scope.ghosts = update;
        })
       $scope.modal.hide();
    }
});