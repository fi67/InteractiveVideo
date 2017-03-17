/*
 * CONSTANTS
 */
var TIMING_AT_END = -1;


/*
 * GLOBALS
 */
var sdvCoordinator;



/*
 * Initialization
 */


(function(sdvElement){

	function error(message){
		alert(message);
	}
	
	// Check if sdvElement was found in page
	if(typeof sdvElement === "undefined"){
		return error("Could not find element with data-sdv-json attribute");
	}
	
	// Check data-sdv-json attribute is sensible
	var jsonURL = sdvElement.getAttribute("data-sdv-json");
	if(typeof jsonURL === "undefined" || jsonURL.length < 1){
		return error("data-sdv-json attribute not set to valid path to json file.");
	}
	
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.open('get', jsonURL);
	xmlHttpRequest.onreadystatechange = function(){
		// Wait for the complete state (4)
		if(xmlHttpRequest.readyState === 4){
			// Wait for a success HTTP code (200)
			if(xmlHttpRequest.status === 200){
				
				// Check for empty JSON response
				if(xmlHttpRequest.responseText.length < 1){
					return error("Failed to parse JSON. Please check JSON file for errors in formatting or try using a JSON validator.");
				}
				
				// Try to parse JSON to a JS object
				var config;
				try{
					config = JSON.parse(xmlHttpRequest.responseText);
				}catch(jsonError){
					console.log(jsonError);
					return error("Failed to parse JSON. Please check JSON file for errors in formatting or try using a JSON validator.");
				}
				
				// All configuration looks good, set up the element
				setupSuperDuperVideo(sdvElement, config);
			}else{
				return error("Failed to load " + jsonURL + " via AJAX");
			}
		}
	}
	xmlHttpRequest.onerror = function(xmlHttpRequestError){
		console.log(xmlHttpRequestError);
		return error("Failed to load " + jsonURL + " via AJAX");
	}
	xmlHttpRequest.send(null);
	
	
	
	function setupSuperDuperVideo(element, config){
		
		// Check user has specified a firstVideoTrack
		if(typeof config.firstVideoTrack === "undefined"){
			return error("You must specify a firstVideoTrack");
		}
		
		var videoElement = element.querySelector("video");
		if(typeof videoElement === "undefined"){
			return error("Could not find video element inside the superdupervideo element");
		}
		
		// TODO: Check config has videotracks
		
		// Create the Coordinator, with no tracks to start with
		sdvCoordinator = new SuperDuperVideoCoordinator({
			domElement: element,
			videoElement: videoElement,
			tracks: {},
			firstVideoTrack: config.firstVideoTrack
		});
		
		// Loop over all video tracks
		for(var trackName in config.videoTracks){
			// When doing a for..in loop in JS, use hasOwnProperty to guard against unwelcome changes to the Object prototype
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
			if(config.videoTracks.hasOwnProperty(trackName)){
				
				// Save track config to a variable for convenience
				var trackConfig = config.videoTracks[trackName];
				
				// TODO: Check formats exists
				
				// Create a Track for each videoTrack
				var track = new Track({
					formats: trackConfig.formats,
					controls: trackConfig.controls,
					endAction: trackConfig.endAction,
					name: trackName
				});
				
				
				// Loop over all Actions in this track
				if(typeof trackConfig.actions !== "undefined"){
					for(var i = 0; i < trackConfig.actions.length; i++){
						
						// Save action config to a variable for convenience
						var actionConfig = trackConfig.actions[i];
						
						// Create an Action object for each action in the json
						var action = null;
						var events = [];
						
						// Loop over all Events in the action
						for(var j = 0; j < actionConfig.events.length; j++){
							
							switch(actionConfig.events[j].response.toUpperCase()){
								case "ADDCLASS":
									events.push(new AddClassEvent(actionConfig.events[j]));
									break;
									
								case "REMOVECLASS":
									events.push(new RemoveClassEvent(actionConfig.events[j]));
									break;
									
								case "GOTOVIDEOTRACK":
									events.push(new GoToVideoTrackEvent(actionConfig.events[j]));
									break;
									
								case "CHANGECONTENT":
									events.push(new ChangeContentEvent(actionConfig.events[j]));
									break;
									
								case "RESTORECONTENT":
									events.push(new RestoreContentEvent(actionConfig.events[j]));
									break;
								
								case "OPENURL":
									events.push(new OpenURLEvent(actionConfig.events[j]));
									break;
								
								default:
									console.log("Sorry, " + actionConfig.events[j].response + " is not a valid response");
							}
						}
						
						// Inject the created array of Events into the actionConfig
						actionConfig.events = events;
						
						// Use this to create the action
						action = new Action(actionConfig);
						
						if(action !== null){
							// Has the user specified dimensions?
							if(typeof trackConfig.actions[i].dimensions !== "undefined"){
								action.dimensions = new Dimensions(trackConfig.actions[i].dimensions);
							}
							
							// Has the user specified timing?
							if(typeof trackConfig.actions[i].timing !== "undefined"){
								action.timing = new Timing(trackConfig.actions[i].timing);
							}
															
							
							// Set the trigger for the action
							action.trigger = actionConfig.trigger;
						
							// Add the action onto the Track
							track.actions.push(action);
						}
						
				
						
					}
				}
				
				
				// Associate this track using it's name with the coordinator
				sdvCoordinator.tracks[trackName] = track;
				
			}
		}
		
		console.log(sdvCoordinator);
		
		
		// Set up timeupdate listener
		sdvCoordinator.videoElement.addEventListener("timeupdate", function(e){
			sdvCoordinator.tick();
		});
		
		// Set up ended listener
		sdvCoordinator.videoElement.addEventListener("ended", function(e){
			sdvCoordinator.videoTrackEnded();
		});
		
		
		// TODO: Check firstVideoTrack is actually a track
		
		sdvCoordinator.playFirstTrack();
		
	}
	
}(document.querySelector("[data-sdv-json]")));