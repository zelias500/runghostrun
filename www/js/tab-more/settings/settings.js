app.config(function($stateProvider){
	$stateProvider.state('tab.settings', {
        url: '/settings',
        data:{
            authenticate: true
        },
        views:{
            'tab-more': {
                templateUrl: 'js/tab-more/settings/settings.html',
                controller: 'SettingsCtrl'
            },
        }
    });
});

app.controller('SettingsCtrl', function ($scope, $ionicModal, SettingFactory, UserFactory, Session, $ionicPopup) {

    $scope.user = Session.user;

    $scope.displayDistanceUnit = function() {
        return !$scope.user.isMetric ? "km" : "miles";
    }

    $scope.saveUser = function() {
        UserFactory.update($scope.user._id, $scope.user)
        .then(
            function() {
                $ionicPopup.alert({
                    title: "Success!",
                    template: "Your profile has been successfully updated"
                })
            },
            function() {
                $ionicPopup.alert({
                    title: "Failure!",
                    template: "There was a problem updating your profile. Please try again"
                })
            }
        )
    }

    $ionicModal.fromTemplateUrl('js/tab-more/settings/profile-pic.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
    });

    $scope.openModal = function(){
        $scope.modal.show();
    };
    $scope.closeModal = function(){
        $scope.modal.hide();
    };


});
