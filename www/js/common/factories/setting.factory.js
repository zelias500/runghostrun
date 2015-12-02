app.factory('SettingFactory', function(){
    var factory = {};

    var data = {
    	unit: 'km',
    	privacy: false
    }

    factory.getUnit = function(){
    	return data.unit
    };
    factory.setUnit = function(unit){
       data.unit = unit;
    };
    factory.getPrivacy = function(){
    	return data.privacy;
    };
    factory.setPrivacy = function(privacy){
    	data.privacy = privacy;
    };


    return factory;
})
