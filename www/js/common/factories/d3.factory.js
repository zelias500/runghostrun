app.factory('d3Factory', function(TimeFactory){
	var d3Stuff = {
		'Recent Distance': {
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
                    duration: 0,
                    xAxis: {
                        axisLabel: 'Last 5 Runs',
                        tickFormat: function(d){
                        	return d3.time.format('%m-%d')(new Date(d));
                        }
                        
                    },
                    yAxis: {
                        axisLabel: 'Distance',
                        axisLabelDistance: 0
                    }
                },
                title: {
                    enable: true,
                    text: 'Recent Distance',
                    css: {
    					'color':'#fff'
    				}
                }
            },
            transformer: function (viewData) {
            	var count = 1;
            	return [{
							key: 'Recent Runs',
							values: viewData.map(data => {
								return {
									'label': moment.utc(data.timestamp).valueOf(),
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
    				duration: 0,
    				xAxis: {
    					axisLabel: 'Last 5 Runs',
    					tickFormat: function(d){
    						return d;
                        }
    				},
    				yAxis: {
    					axisLabel: 'Pace',
    					tickFormat: function(d){
    						return d3.format('.02f')(d);
    					}
    				},
    				yDomain: [0,3]
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
    			var count = 1;
            	return [{
							key: 'Pace',
							values: someData.map(data => {
								return {
									'label': count++,
									'value': data.pace
								}
							}),
							color: '#ff7f0e'
						}]
    		}
    	},
        'ghost': {
            options: {
                chart: {
                    type: 'multiBarHorizontalChart',
                    height: 300,
                    margin : {
                        top: 20,
                        right: 30,
                        bottom: 50,
                        left: 80
                    },
                    x: function(d){return d.label; },
                    y: function(d){return d.value; },
                    showValues: true,
                    valueFormat: function(d){
                        return TimeFactory.timeDisplay(d);
                    },
                    duration: 0,
                    xAxis: {
                        tickFormat: function(d){
                            return d;
                        }
                    },
                    key:false
                },
                title: {
                    enable: true,
                    text: 'Leaderboard',
                    css: {
                        'color':'#fff'
                    }
                },
                showLegend: false
            },
            transformer: function (viewData) {
                var count = 1;
                return [{
                            values: viewData.map(data => {
                                return {
                                    'label': (data.runner.displayName || data.runner.email) + "-"+(count++),
                                    'value': data.time // in seconds
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
            if (string === "Pace over Time"){
                var bounds = [1000, 0];
                newData.forEach( data => {
                    data.pace = (data.distance/1000)/(data.time/60);
                    bounds[0] = Math.min(bounds[0], data.pace);
                    bounds[1] = Math.max(bounds[1], data.pace);
                })
                bounds[0] = Math.max(bounds[0] - .10, 0);
                bounds[1] = bounds[1] + .10;
                toReturn.options.chart.yDomain = bounds;
            }

			toReturn.data = toReturn.transformer(newData);
			return toReturn;
		}
	}

})