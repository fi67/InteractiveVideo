
/*
 * CORE CLASSES
 */

function SuperDuperVideoCoordinator(params){
	this.defaults = {
		domElement: null,
		videoElement: null,
		tracks: [],
		firstVideoTrack: null,
		videoDirectory: "videos",
		activeTrackName: null
	};
	
	this.playTrack = function(trackName, startTime){
		console.log("playTrack: " + trackName + " at time: " + startTime);
		
		// Unload previous annotations
		if(this.activeTrackName !== "undefined" && this.activeTrackName !== null){
			this.tracks[this.activeTrackName].stoppedPlaying();
		}

		// Check the track exists
		if(typeof this.tracks[trackName] === "undefined"){
			console.log("Cannot play track " + trackName + " because it does not exist.");
			return;
		}

		this.activeTrackName = trackName;
		this.tracks[trackName].play(this.videoElement, this.videoDirectory, startTime);
		
		//this.preloadTracksFollowingTrack(trackName);
	}
	
	this.playFirstTrack = function(){
		this.playTrack(this.firstVideoTrack, 0);
	}
	
	this.tick = function(){
		// Called when HTML5 video says time has updated
		if(typeof this.activeTrackName !== "undefined" && typeof this.tracks[this.activeTrackName] !== "undefined"){
			this.tracks[this.activeTrackName].tick(this.videoElement.currentTime * 1000);
		}
	}
	
	this.videoTrackEnded = function(){
		// Called when HTML5 video says the video has ended
		if(typeof this.activeTrackName !== "undefined" && typeof this.tracks[this.activeTrackName] !== "undefined"){
			this.tracks[this.activeTrackName].ended();
		}
	}
	
	// this.preloadTracksFollowingTrack = function(trackName){
	// 	console.log("preloadTracksFollowingTrack: " + trackName);
	// }
	
	applyParamsAndDefaults(this, params, this.defaults);
}

function Track(params){
	this.defaults = {
		formats: [],
		controls: false,
		endAction: "STOP",
		actions: [],
		name: null,
		lastPosition: -1
	}
	
	this.play = function(videoElement, videoDirectory, startTime){
		console.log("Play in video element: ", videoElement);
		var supportedFormat = "";
		var supportedType = "";
		if(this.formats.indexOf("webm") !== -1 && Modernizr.video.webm !== ""){
			// webm supported!
			console.log("webm supported!");
			supportedFormat = "webm";
			supportedType = "video/webm";

		}else if(this.formats.indexOf("mp4") !== -1 && Modernizr.video.h264 !== ""){
			// mp4 supported!
			console.log("h264 supported!");
			supportedFormat = "mp4";
			supportedType = "video/mp4";

		}else if(this.formats.indexOf("ogv") !== -1 && Modernizr.video.ogg !== ""){
			// ogv supported!
			console.log("ogg supported!");
			supportedFormat = "ogv";
			supportedType = "video/ogg";
			
		}else if(this.formats.indexOf("ogg") !== -1 && Modernizr.video.ogg !== ""){
			// ogg supported!
			console.log("ogg supported!");
			supportedFormat = "ogg";
			supportedType = "video/ogg";
			
		}else{
			console.log("no support for any of those formats");
			return;
		}
		
		this.lastPosition = -1;
		
		videoElement.innerHTML = "";
		
		console.log(supportedType);
		videoElement.setAttribute("type", supportedType);
		videoElement.src = videoDirectory + "/" + this.name + "." + supportedFormat;
		videoElement.poster = videoDirectory + "/" + this.name + ".jpg";
		videoElement.load();
		videoElement.currentTime = startTime;
		videoElement.play();
		
		if(this.controls === true){
			videoElement.setAttribute("controls", "controls");
		}else{
			videoElement.removeAttribute("controls");
			
			if(typeof this.controls === "string"){
				// Own controls - a queryselector was given!
				this.enableOwnControls(true);
			}
		}
		
	}
	
	this.enableOwnControls = function(enable){
		console.log("enableOwnControls", enable, this.controls);
		if(typeof this.controls === "string"){
			// Own controls - a queryselector was given!
			var matchingElements = document.querySelectorAll(this.controls);
			console.log(matchingElements);
			for(var i = 0; i < matchingElements.length; i++){
				matchingElements[i].style.display = (enable)? "block" : "none";
			}
		}
	}
	
	
	this.tick = function(videoCurrentTime){
		//console.log("This track will tick", this.name, videoCurrentTime);
		
		for(var i = 0; i < this.actions.length; i++){
			
			// Is this event ready to start
			if(videoCurrentTime < this.actions[i].timing.start){
				//console.log("Skipping event (too early): " + this.actions[i]);
			
			}else if(this.lastPosition < this.actions[i].timing.start){
				
				// Set up all events within this action
				for(var j = 0; j < this.actions[i].events.length; j++){
					switch(this.actions[i].events[j].trigger.toUpperCase()){
						// Time based triggers
						case "TIME":
							this.actions[i].events[j].perform();
							break;
						
						// Click
						case "CLICK":			
							this.actions[i].setVisible(sdvCoordinator.domElement, true);
							this.actions[i].enableListener("click", true);
							break;
							
						// Pointer Down
						case "POINTERDOWN":	
							// TODO: Support Touch too
							// Will involve a preventDefault in the listener for touchstart		
							this.actions[i].setVisible(sdvCoordinator.domElement, true);
							this.actions[i].enableListener("mousedown", true);
							break;
							
						// Pointer Up
						case "POINTERUP":
							// TODO: Support Touch too
							// Will involve a preventDefault in the listener for touchend			
							this.actions[i].setVisible(sdvCoordinator.domElement, true);
							this.actions[i].enableListener("mouseup", true);
							break;
							
						// Key Down
						case "KEYDOWN":			
							this.actions[i].enableListener("keydown", true);
							break;
							
						// Key Up
						case "KEYUP":			
							this.actions[i].enableListener("keyup", true);
							break;
							
						
							
						default:
							console.log("Trigger not recognised: ", this.actions[i].events[j].trigger);
					}
				}

			}
			
			// Is this event ready to end
			if(videoCurrentTime < this.actions[i].timing.end){
				//console.log("Skipping event (too early): " + this.actions[i]);
			
			}else if(this.lastPosition < this.actions[i].timing.end){
				
				// Unload all events within this action
				for(var j = 0; j < this.actions[i].events.length; j++){
					switch(this.actions[i].events[j].trigger.toUpperCase()){
						// Time based triggers
						case "TIME":
							// No action needed to unload a time based event
							break;
						
						// Click
						case "CLICK":			
							this.actions[i].setVisible(sdvCoordinator.domElement, false);
							this.actions[i].enableListener("click", false);
							break;
							
						// Pointer Down
						case "POINTERDOWN":			
							this.actions[i].setVisible(sdvCoordinator.domElement, false);
							this.actions[i].enableListener("mousedown", false);
							break;
							
						// Pointer Up
						// TODO: Support Touch too
						// Will involve a preventDefault in the listener for touchstart
						case "POINTERUP":			
							this.actions[i].setVisible(sdvCoordinator.domElement, false);
							this.actions[i].enableListener("mouseup", false);
							break;
							
						// Key Down
							// TODO: Support Touch too
							// Will involve a preventDefault in the listener for touchend
						case "KEYDOWN":			
							this.actions[i].enableListener("keydown", true);
							break;
							
						// Key Up
						case "KEYUP":			
							this.actions[i].enableListener("keyup", true);
							break;
							
						default:
							console.log("Trigger not recognised: ", this.actions[i].events[j].trigger);
					}
				}

			}else{
				//console.log("Not ready for event: " + this.actions[i]);
			}
			
		}
		
		this.lastPosition = videoCurrentTime;
	}
	
	// Called when the track is about to stop playing - not necessarily because it has ended
	this.stoppedPlaying = function(){
		// Unload all annotations
		this.unloadAllActions();
		
		if(typeof this.controls === "string"){
			// Turn off own controls
			this.enableOwnControls(false);
		}
	}
	
	this.ended = function(){
		// Called when this track has ended
		console.log("Ended! end action is: " + this.endAction);
		
		this.stoppedPlaying();
		
		switch(this.endAction.toUpperCase()){
			case "REPEAT":
				// Repeat
				sdvCoordinator.playTrack(sdvCoordinator.activeTrackName, 0);
				break;
			case "REWIND":
				// Rewind
				sdvCoordinator.videoElement.currentTime = 0;
				break;
			default:
				// Includes Stop
				// Do nothing - the video will by default stop at the end
				break;
			
		}
	}
	
	this.unloadAllActions = function(){
		// Loop over all actions
		for(var i = 0; i < this.actions.length; i++){
			// Hide the DOM elements associated with this action
			this.actions[i].setVisible(sdvCoordinator.domElement, false);
			
			// Loop over all events associated with this action
			for(var j = 0; j < this.actions[i].events.length; j++){
				switch(this.actions[i].events[j].trigger.toUpperCase()){
					case "CLICK":
						this.actions[i].enableListener("click", false);
						break;
					case "POINTERDOWN":
						this.actions[i].enableListener("mousedown", false);
						break;
					case "POINTERUP":
						this.actions[i].enableListener("mouseup", false);
						break;
					case "KEYDOWN":
						this.actions[i].enableListener("keydown", false);
						break;
					case "KEYUP":
						this.actions[i].enableListener("keyup", false);
						break;
					
				}
			}
		}
	}
	
	applyParamsAndDefaults(this, params, this.defaults);
}

function Dimensions(params){
	this.defaults = {
		x: "0",
		y: "0",
		width: "100%",
		height: "100%",
		html: ""
	}
	
	applyParamsAndDefaults(this, params, this.defaults);
}

function Timing(params){
	this.defaults = {
		start: 0,
		end: TIMING_AT_END
	}
	
	applyParamsAndDefaults(this, params, this.defaults);

	
	if(typeof this.start === "string"){
		this.start = normalizeTime(this.start);
	}
	if(typeof this.end === "string"){
		this.end = normalizeTime(this.end);
	}
	
	// Bump anything which would start at 0ms to 1ms
	// Works better if user scrubs manually back to the start
	if(this.start == 0){
		this.start = 1;
	}
	
}


function Action(params){
	this.defaults = {
		dimensions: new Dimensions(),
		timing: new Timing(),
		events: [],
		element: document.createElement("div"),
		enabledListeners:[]
	}
	
	applyParamsAndDefaults(this, params, this.defaults);
	
	this.element.className = "sdv-annotation";
	
	this.setVisible = function(element, visible){
		this.element.style.top = this.dimensions.y;
		this.element.style.left = this.dimensions.x;
		this.element.style.width = this.dimensions.width;
		this.element.style.height = this.dimensions.height;
		this.element.innerHTML = this.dimensions.html;
	
		if(visible){
			element.appendChild(this.element);
		}else{
			if(this.element.parentElement == element){
				element.removeChild(this.element);
			}
		}
	}
	
	// Call to enable or disable the event
	this.enableListener = function(event, enable){
		var action = this;
	
		if(enable){
			// Has the event listener been set up before?
			if(typeof this.enabledListeners[event] === "undefined"){
				// No, so set up the listener for the first time
			
				if(event === "keydown" || event === "keyup"){
					// Keyboard events should be added to the window
					window.addEventListener(event, handleEvent);
				}else{
					this.element.addEventListener(event, handleEvent);			
				}
			
			}	
		}

		this.enabledListeners[event] = enable;

		
		function handleEvent(e){
			if(action.enabledListeners[event] !== true){
				return;
			}
			
			// Loop through events, then see which should be triggered
			for(var i = 0; i < action.events.length; i++){
				
				if(action.events[i].trigger.toUpperCase() === "CLICK" && e.type.toUpperCase() === "CLICK"){
					// If this action has a click trigger, was the user's gesture a click? 
					action.events[i].perform();
				
				}else if(action.events[i].trigger.toUpperCase() === "POINTERUP" &&
							(e.type.toUpperCase() === "MOUSEUP" || e.type.toUpperCase() === "TOUCHEND" || e.type.toUpperCase() === "POINTERUP") ){
					// If this action has a pointerup trigger, was the user's gesture a mouseup, touchend or pointerup? 
					action.events[i].perform();
				
				}else if(action.events[i].trigger.toUpperCase() === "POINTERDOWN" &&
							(e.type.toUpperCase() === "MOUSEDOWN" || e.type.toUpperCase() === "TOUCHSTART" || e.type.toUpperCase() === "POINTERDOWN") ){
					action.events[i].perform();
				
				}else if(action.events[i].trigger.toUpperCase() === "KEYDOWN" && e.type.toUpperCase() === "KEYDOWN"){
					
					if(action.events[i].key === null){
						// If key is not specified, always perform the action
						action.events[i].perform();
					
					}else if(action.events[i].key === e.keyCode){
						// If key is specified and matches the key the user pressed, then do it
						action.events[i].perform();
					}
				
				}else if(action.events[i].trigger.toUpperCase() === "KEYUP" && e.type.toUpperCase() === "KEYUP"){
					if(action.events[i].key === null){
						// If key is not specified, always perform the action
						action.events[i].perform();
					
					}else if(action.events[i].key === e.keyCode){
						// If key is specified and matches the key the user pressed, then do it
						action.events[i].perform();
					}
				}
				
			}
		}
	
	}
	

}

