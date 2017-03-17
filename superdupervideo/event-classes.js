function Event(params){
	this.defaults = {
		trigger: null,
		response: null,
		key: null
	};
	
	applyParamsAndDefaults(this, params, this.defaults);
	

	this.perform = function(){
		console.log("You should use a subclass of Event");
	}
}

function ClassEvent(params){
	Event.apply(this, arguments);

	this.defaults.class = null;
	this.defaults.elementsQuery = null;
	
	this.perform = function(){
		console.log("You should use a subclass of ClassAction");
	}

	applyParamsAndDefaults(this, params, this.defaults);
}

function AddClassEvent(params){
	ClassEvent.apply(this, arguments);
	
	this.perform = function(){
		console.log("perform!");
		var matchingElements = document.querySelectorAll(this.elementsQuery);
		for(var i = 0; i < matchingElements.length; i++){
			matchingElements[i].classList.add(this.class);
		}
	}
	
	applyParamsAndDefaults(this, params, this.defaults);
}

function RemoveClassEvent(params){
	ClassEvent.apply(this, arguments);
	
	this.perform = function(){
		var matchingElements = document.querySelectorAll(this.elementsQuery);
		for(var i = 0; i < matchingElements.length; i++){
			matchingElements[i].classList.remove(this.class);
		}
	}
	
	applyParamsAndDefaults(this, params, this.defaults);
}

function VideoTrackEvent(params){
	Event.apply(this, arguments);
	
	this.defaults.seekToSameTime = false;
	this.defaults.seekToTime = -1;
	
	this.perform = function(){
		console.log("You should use a subclass of VideoTrackEvent");
	}
	
	applyParamsAndDefaults(this, params, this.defaults);
}

function GoToVideoTrackEvent(params){
	VideoTrackEvent.apply(this, arguments);
	
	this.defaults.trackName = null;
	
	this.perform = function(){
		// Assume we want to start at the beginning...
		var trackStartTime = 0;
		
		if(this.seekToSameTime === true){
			// ... unless, we've got seekToSameTime set to true ...
			// Seek to the same time
			trackStartTime = sdvCoordinator.videoElement.currentTime;
			
		}else if(this.seekToTime != -1){
			// ... OR we've got a custom start time set
			// Convert from MS to Seconds
			trackStartTime = normalizeTime(this.seekToTime) / 1000;
		}
		
		sdvCoordinator.playTrack(this.trackName, trackStartTime);
	}
	
	applyParamsAndDefaults(this, params, this.defaults);
}


function ContentEvent(params){
	Event.apply(this, arguments);
	
	this.defaults.elementsQuery = null;
	
	this.perform = function(){
		console.log("You should use a subclass of ContentEvent");
	}
	
	applyParamsAndDefaults(this, params, this.defaults);
}

function ChangeContentEvent(params){
	ContentEvent.apply(this, arguments);

	this.defaults.content = null;
	
	this.perform = function(){
		var matchingElements = document.querySelectorAll(this.elementsQuery);
		for(var i = 0; i < matchingElements.length; i++){
			matchingElements[i].setAttribute("data-oldcontent", matchingElements[i].innerHTML);
			matchingElements[i].innerHTML = this.content;
		}
	}
	
	applyParamsAndDefaults(this, params, this.defaults);
}

function RestoreContentEvent(params){
	ContentEvent.apply(this, arguments);
	
	this.perform = function(){
		var matchingElements = document.querySelectorAll(this.elementsQuery);
		for(var i = 0; i < matchingElements.length; i++){
			var oldContent = matchingElements[i].getAttribute("data-oldcontent");
			if(typeof oldContent !== 'undefined'){
				matchingElements[i].innerHTML = oldContent;				
			}
		}
	}

	applyParamsAndDefaults(this, params, this.defaults);
}

function OpenURLEvent(params){
	Event.apply(this, arguments)

	this.defaults.url = null;
	this.defaults.usePopup = true;
	
	this.perform = function(){
		if(this.usePopup){
			window.open(this.url);
		}else{
			location.href = this.url;
		}
	}

	applyParamsAndDefaults(this, params, this.defaults);
}