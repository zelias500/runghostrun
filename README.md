#Ghost Runner

## Table of Contents

- [Presentation](#resentation)
- [Summary](#summary)
- [Tools](#tools)
- [Use](#use)
- [Modify](#modify)
- [Contributors](#contributors)

## Presentation

See our presentation [here](http://www.fullstackacademy.com/final-projects/ghost-runner-mobile-social-fitness-run-tracking-application).


## Summary

Ghost runner is a mobile social fitness application that aims to make running a more enjoyable experience. To do this when you go running we track your location and save your run as 'Ghost'. Once a ghost is created you can either challenge your friends to beat your Ghost time or simply run the same path the next time you go running. When challenging a previous run ('Ghost') you are able to see the previous runner's path and have a voice coach that will tell you whether you are running behind or ahead of the current leader. When a ghost have several runs you can then view a leaderboard with the times and names of each runner. Additionally when you view your profile you can see your recent run statistics.

## Tools

To create this app we used the MEAN(Mongo, Express, Angular, Node) stack, Ionic, D3 and the GoogleMaps API. 

We used ionic for easy cross-platform deployment and in order to add mobile swipe and drag features that users have grown accustomed to. 

We used D3 for our data visualization (leaderboard and recent run stats). 

We used the GoogleMaps API to display the live run path of a runner and ,if they are challenging a 'Ghost' (previous run), where the path the previous runner took.

## Use

If you want to give our application a try, pick up your phone and head on over to http://ghostrunner.xyz . Feel free to give us any and all feedback.

## Modify

If you want to play around with our code and modify anything, go ahead! 
Be sure to install dependencies

	```bash
	npm install    # installs node packages
	bower install  # installs bower dependencies
	```

Then run gulp and npm start in two seperate tabs to run the app on your computer (note since this is a mobile application, limited testing can be done using a localhost. If you are trying to do more substantial changes it can be best to deploy to heroku or another platform)

	```bash
	gulp    # installs node packages
	npm start # starts the app
	```

## Contributors
* __Matthew Thiery__ - [LinkedIn](https://www.linkedin.com/in/matthewthiery) | [GitHub](https://github.com/mbthiery)
* __Tom Kelly__ - [LinkedIn](https://www.linkedin.com/in/thomas-kelly-867155b8) | [GitHub](https://github.com/tmkelly28)
* __Vivie Wen__ - [LinkedIn](	
https://www.linkedin.com/in/hsin-wei-vivie-wen-075ab391) | [GitHub](https://github.com/viviechu)
* __Zack Elias__ - [LinkedIn](	
https://www.linkedin.com/in/zacharyelias) | [GitHub](https://github.com/zelias500)
