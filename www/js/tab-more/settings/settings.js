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

app.controller('SettingsCtrl', function ($scope, SettingFactory,UserFactory, Session, $ionicModal) {

    $scope.check = SettingFactory.getPrivacy()
    $scope.changePrivacy = function(){
        $scope.check = !$scope.check
        SettingFactory.setPrivacy($scope.check)
    };

    $scope.useKm = function(){
        SettingFactory.setUnit("km")
    };
    $scope.useMile = function(){
        SettingFactory.setUnit("mi")
    };

    $scope.changeName = function(name){

        UserFactory.update(Session.user._id, {displayName: name})

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