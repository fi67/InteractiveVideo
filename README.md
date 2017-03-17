// NOTE: Comments are not allowed in real JSON - so remove them

{
   TO DO:  // Optional path to videos. If not present, "/videos" is assumed.
    "videoDirectory" : "/optional/path/to/videos",

    "firstVideoTrack": "introduction",

    // List of different video tracks
    "videoTracks" : {
        "introduction": {
            // Supported video formats
            "formats": [
                "webm"
                "mp4"
             ],
             "controls": true,  // Also valid: false or string containing querySelector (e.g. "#mycontrols" or ".my-controls") which will be toggled between display:block and display:none
             "endAction": "repeat", //Other options are "stop" (stop at end) and "rewind" (stop at start of video), 
             
            "actions": [
               
                    // Between 120s and 140s, add an annotation which if clicked will go to another video track
                {
                    // Dimensions - % recommended for responsive video
                    // If not present, a full width/height hotspot is assumed
                    "dimensions" : {
                        "x" : "30px",
                        "y" : "20px",
                        "width" : "30%",
                        "height" : "20%"
                    },
                    // Timing is in ms
                    // If not present, all the way through
                    "timing" : {
                        "start" : 120000,
                        "end" : 140000
                    },
                    "events" : 
                    [
                    	{
							"trigger": "keydown",
							"response": "addClass",
							"elementsQuery" : "h1",
							"class": "alternative"
						},
                    	{
							"trigger": "keyup",
							"response": "removeClass",
							"elementsQuery" : "h1",
							"class": "alternative"
						}
                    ]
                    
               },

                // On keydown add a class to the h1 of alternative, on keyup remove it)
               


// Action Types (Triggers):
"click"                   // When the annotation is clicked or touched. Elements property can appear. If it does, the event listener is added to all matching elements (querySelectorAll). If it does not appear, the target is the annotation.
"time"                    // When a certain time in the timing block is reached. Timing block is also required.
"pointerdown"             // When the user starts a click with their mouse, or starts a touch with their finger. Elements property can appear. If it does, the event listener is added to all matching elements (querySelectorAll). If it does not appear, the target is the annotation.
"pointerup"               // When the user ends a click with their mouse, or ends a touch with their finger. Elements property can appear. If it does, the event listener is added to all matching elements (querySelectorAll). If it does not appear, the target is the annotation.
"keydown"                 // When the user starts pressing a keyboard key. Not currently supported on mobile. Any key is assumed to trigger this, unless a "key" property appears, which should match up with the keyCode given for a keydown event.
"keyup"                   // When the user ends pressing a keyboard key. Not currently supported on mobile. Any key is assumed to trigger this, unless a "key" property appears, which should match up with the keyCode given for a keyup event.

// Supported responses:
{
    "response": "goToVideoTrack",
    "trackName": "nameOfVideoTrackToLoad",  // OPTIONAL The name of the video track to load. Same video if not included.
    "seekToTime": 30                        // OPTIONAL How many seconds in to seek. 
    "seekToSameTime":true // optional - assume false if not present
}

{
    "response" : "addClass",
    "elementsQuery" : "#container",          // REQUIRED Passed into querySelectorAll - so supports any css selector
    "class" : "nighttime"               // REQUIRED The class to add
}

{
    "response" : "removeClass",
    "elementsQuery" : "#container",          // REQUIRED Passed into querySelectorAll - so supports any css selector
    "class" : "nighttime"               // REQUIRED The class to remove
}

{
    "response": "changeContent",
    "elementsQuery": "#container",           // REQUIRED Passed into querySelectorAll - so supports any css selector
    "content": "<b>Hello World</b>"     // REQUIRED The HTML content to change. Before the JS changes this, it caches the old innerHTML on a data attribute to allow later restoring. NOTE: The stored content will be overwritten - there is no history chain of old content kept.
}

{
    "response": "restoreContent",
    "elementsQuery": "#container",           // REQUIRED Passed into querySelectorAll - so supports any css selector - uses the last value cached when changeContent action was called
}

{
    "response": "openURL",
    "url": "http://www.google.com",     // REQUIRED The URL to open
    "usePopup": false                   // OPTIONAL. true is assumed.
}




// V2 automatically/inferred things ("Convention over configuration")
• Infer video path from video track name and format. (e.g. /videos/TRACKNAME.FORMAT )
• Infer poster image path from video track name. (e.g. /videos/TRACKNAME.jpg )
• All timings are in milliseconds if specified as a number
• All timings are parsed as ((hours:)mins:)secs(.millisecs) if specified as a string
    • e.g. "1:43:32.54" is 1 hour, 43 minutes, 32 seconds, 54 milliseconds
    • e.g. "1:34.23" is 1 minute, 34 seconds, 23 milliseconds
    • e.g. "2.451" is 2 seconds, 451 milliseconds
    • e.g. "43" is 43 seconds
    • BUT!! remember without a string (without quotes around), it's milliseconds ->
    • e.g. 43 is 43 milliseconds
    • e.g. 32.5 is 32.5 milliseconds

// V3 (Not completed)
• Keyboard / Alternatives for mobile
• Subtitles
• Choice of subtitle files - auto detect from html lang
• Fix for IOS



