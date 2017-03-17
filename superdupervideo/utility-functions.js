/*
 * UTILITY FUNCTIONS
 */

/**
 * Applies a list of defaults to an object.
 * Prefers the key from params if available
 *
 * @param obj The object to apply the properties to
 * @param params An object of parameters to set
 * @param defaults An object of defaults to use if the key is not found in params
 */
function applyParamsAndDefaults(obj, params, defaults){
    // Handle missing params
	if(typeof params === 'undefined') params = {};
  
	// Loop through all defaults
	for(var key in defaults){
		if(defaults.hasOwnProperty(key)){
			// Use the default value if there isn't one set in params
			if(typeof params[key] !== 'undefined'){
				obj[key] = params[key];
			}else{
				obj[key] = defaults[key];			
			}	
		}
	}
}


/**
 * Takes a time as a number (milliseconds) or as a string (H:M:S.MS format) and returns a number of milliseconds.
 *
 * @param time A number of milliseconds or a string. Format: [[H:]M:]S[.MS], where square brackets denote optional parts
 */
function normalizeTime(time){
	
	if(time.toUpperCase() === "END"){
		return TIMING_AT_END;
	}
	
	var ms = 0, s = 0, m = 0, h = 0;
	
	// Check for milliseconds
	var periodPosition = time.indexOf(".");
	if(periodPosition !== -1){
		var ms = parseInt(time.substr(periodPosition + 1));
		time = time.substr(0, periodPosition);
		console.log("ms: ", ms, "time is now: " + time);
	}
	
	// Split on colon
	var timeParts = time.split(":");
	if(timeParts.length > 3){
		console.log("Not a valid time - too many colons: ", time);
	}else if(timeParts.length === 3){
		// H:M:S
		h = parseInt(timeParts[0]);
		m = parseInt(timeParts[1]);
		s = parseInt(timeParts[2]);
	}else if(timeParts.length === 2){
		m = parseInt(timeParts[0]);
		s = parseInt(timeParts[1]);
	}else if(timeParts.length === 1){
		s = parseInt(timeParts[0]);
	}else{
		// No h:m:s specified
	}
	
	//console.log("Parsed time as: " + h + "h " + m + "m " + s + "s " + ms + "ms");
	//console.log("Milliseconds: ", ms + (s * 1000) + (m * 60000) + (h * 3600000));
	
	return ms + (s * 1000) + (m * 60000) + (h * 3600000);
}