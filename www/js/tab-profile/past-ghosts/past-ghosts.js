app.config(function ($stateProvider) {
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

app.controller('PastGhostsCtrl', function ($scope, $ionicModal, ghosts, GhostFactory, UserFactory, Session) {

    $scope.ghosts = ghosts;

    $scope.editGhost = function (ghost) {
        $scope.modal.show();
        $scope.selectGhost = ghost
        console.log(ghost);
    }

    $ionicModal.fromTemplateUrl('js/tab-profile/past-ghosts/edit-ghost.html', {
        scope: $scope,
        animation: 'slide-in-down'
    })
    .then(function (modal) {
        $scope.modal = modal;
    });

    $scope.closeModal = function(){
        $scope.modal.hide();
    };

    $scope.updateGhost = function (edit) {
        GhostFactory.update($scope.selectGhost._id, $scope.selectGhost)
        UserFactory.fetchAllGhosts(Session.user._id)
        .then(function(update){
           $scope.ghosts = update;
        })
        $scope.modal.hide();
    }

    $scope.deleteGhost= function () {
        var ghostToRemove = $scope.selectGhost._id;

        GhostFactory.delete($scope.selectGhost._id)
        .then(function () {
            $scope.ghosts = $scope.ghosts.filter(ghost => ghost._id !== ghostToRemove);
        })
        $scope.modal.hide();
    }
});