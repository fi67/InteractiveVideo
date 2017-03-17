/* 
 * Just some example JS video controls
 * These should work with or without superdupervideo
 */

var play = document.getElementById("play"),
	pause = document.getElementById("pause"),
	seek = document.getElementById("seek"),
	volume = document.getElementById("volume"),
	video = document.getElementById("video");

play.addEventListener("click", function(e){
	video.play();
});

pause.addEventListener("click", function(e){
	video.pause();
});

seek.addEventListener("change", function(e){
	video.currentTime = seek.value;
});

volume.addEventListener("change", function(e){
	video.volume = volume.value;
});

video.addEventListener("play", function(e){
	pause.removeAttribute("disabled");
	play.setAttribute("disabled", "disabled");
});

video.addEventListener("pause", function(e){
	pause.setAttribute("disabled", "disabled");
	play.removeAttribute("disabled");
});

video.addEventListener("loadedmetadata", function(e){
	seek.max = video.duration;
});

video.addEventListener("volumechange", function(e){
	volume.value = video.volume;
});

video.addEventListener("timeupdate", function(e){
	seek.value = video.currentTime;
});

video.addEventListener("seeking", function(e){
	seek.value = video.currentTime;
});



