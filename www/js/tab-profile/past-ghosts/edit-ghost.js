app.config(function ($stateProvider) {
	$stateProvider.state('tab.editghost', {
        url: '/edit/:id',
        data:{
            authenticate: true
        },
        views: {
            'tab-profile': {
                templateUrl: 'js/tab-profile/past-ghosts/edit-ghost.html',
                controller: 'EditGhostCtrl'
            }
        },
        resolve: {
            ghost: function (GhostFactory, $stateParams) {
                return GhostFactory.fetchById($stateParams.id);
            }
        }
    });
});

app.controller('EditGhostCtrl', function ($scope, $state, ghost, GhostFactory) {

    $scope.ghost = ghost;

    $scope.updateGhost = function () {
        GhostFactory.update($scope.ghost._id, $scope.ghost)
        .then(_ghost => {
            $scope.ghost = _ghost;
        })
    }

    $scope.deleteGhost= function () {
        GhostFactory.delete($scope.ghost._id)
        .then(() => {
            $state.go('tab.pastghosts');
        })
    }

});