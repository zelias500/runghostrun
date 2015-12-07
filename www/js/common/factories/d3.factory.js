app.factory('d3Factory', function(){
	var d3Stuff = {
		'Recent Run Times': {
            options: {
                    chart: {
                    type: 'discreteBarChart',
                    height: 300,
                    margin : {
                        top: 20,
                        right: 30,
                        bottom: 50,
                        left: 60
                    },
                    x: function(d){return d.label; },
                    y: function(d){return d.value; },
                    showValues: true,
                    valueFormat: function(d){
                        return d3.format(',.2f')(d);
                    },
                    duration: 10,
                    xAxis: {
                        axisLabel: 'Last 5 Runs'
                    },
                    yAxis: {
                        axisLabel: 'Distance'
                    }
                },
                title: {
                    enable: true,
                    text: 'Recent Run Distance',
                    css: {
    					'color':'#fff'
    				}
                }
            },
            transformer: function (someData) {
            	var count = 1;
            	return [{
							key: 'KEY GOES HERE',
							values: someData.map(data => {
								// console.log('data from map', data)
								return {
									'label': count++,
									'value': data.distance
								}
							}),
							color: '#ff7f0e'
						}]
            }
    	},

    	'Pace over Time': {
    		options: {
    			chart: {
    				type: 'lineChart',
    				height: 300,
    				margin: {
    					top: 20,
    					right: 30,
    					bottom: 50,
    					left: 60
    				},
    				x: function(d){return d.label; },
    				y: function(d){return d.value; },
    				showValues: true,
    				valueFormat: function(d){
    					return d3.format(',.2f')(d);
    				},
    				duration: 10,
    				xAxis: {
    					axisLabel: 'Last 5 Runs'
    				},
    				yAxis: {
    					axisLabel: 'Pace',
    					tickFormat: function(d){
    						return d3.format('.02f')(d);
    					}
    				}
    			},
    			title: {
    				enable: true,
    				text: 'Pace over Time',
    				css: {
    					'color':'#fff'
    				}
    			}
    		},
    		transformer: function (someData) {
    			// distance? over time
    			// how far you ran on a given day
    			// d/t over time
    			var count = 1;
            	return [{
							key: 'Avg Pace/Run',
							values: someData.map(data => {
								// console.log('data from map', data)
								return {
									'label': count++,
									'value': data.distance/data.time
								}
							}),
							color: '#ff7f0e'
						}]
    		}
    	}
	}

	return {
		getStatsAbout: function (string, newData) {
			var toReturn = d3Stuff[string];
			toReturn.data = toReturn.transformer(newData);
			return toReturn;
		}
	}








})