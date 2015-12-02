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

app.controller('SettingsCtrl', function ($scope, SettingFactory,$ionicModal,$cordovaCamera) {

    $scope.check = SettingFactory.getPrivacy()
    $scope.changePrivacy = function(){
        $scope.check = !$scope.check
        SettingFactory.setPrivacy($scope.check)
    };

    $scope.useKm = function(){
        SettingFactory.setUnit("km")
        console.log(SettingFactory.getUnit())
    };
    $scope.useMile = function(){
        SettingFactory.setUnit("mi")
        console.log(SettingFactory.getUnit())

    };
    console.log($scope.name);
    $scope.changeName = function(){
        console.log("here")
    }



    // document.addEventListener("deviceready", function () {

    //     var options = {
    //       quality: 50,
    //       destinationType: Camera.DestinationType.DATA_URL,
    //       sourceType: Camera.PictureSourceType.CAMERA,
    //       allowEdit: true,
    //       encodingType: Camera.EncodingType.JPEG,
    //       targetWidth: 100,
    //       targetHeight: 100,
    //       popoverOptions: CameraPopoverOptions,
    //       saveToPhotoAlbum: false,
    //       correctOrientation:true
    //     };

    //     $cordovaCamera.getPicture(options).then(function(imageData) {
    //         console.log(imageData)
    //       // var image = document.getElementById('myImage');
    //       // image.src = "data:image/jpeg;base64," + imageData;
    //     }, function(err) {
    //        console.log(err)
    //     });

    //   }, false);


   $ionicModal.fromTemplateUrl('js/tab-more/settings/profile-pic.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });



});