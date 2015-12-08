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

    $scope.coachEnabled = function() {
        return !$scope.user.speechEnabled ? "disabled" : "enabled";
    }

    $scope.saveUser = function() {
        UserFactory.update($scope.user._id, $scope.user)
        .then(
            function(user) {
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

    // $ionicModal.fromTemplateUrl('js/tab-more/settings/profile-pic.html', {
    //         scope: $scope,
    //         animation: 'slide-in-up'
    //     }).then(function(modal) {
    //         $scope.modal = modal;
    // });

    // $scope.openModal = function(){
    //     $scope.modal.show();
    // };
    // $scope.closeModal = function(){
    //     $scope.modal.hide();
    // };

    $scope.takePicture = function() {
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $cordovaCamera.getPicture(options)
        .then(function(imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            $scope.user.picture = $scope.imgURI;
        }, function(err) {
            $ionicPopup.alert({
                    title: "Something went wrong!",
                    template: "There was a problem updating your picture. Please try again"
            });
        });
    }


});
