const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovement = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayBtn = (e) => {
  //if video is playing , pause it
  if (video.paused) {
    video.play();
  }
  //else plying
  else {
    video.pause();
  }
  playBtn.classList = video.paused ? "fa-solid fa-play " : "fa-solid fa-pause";
};
const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.classList = video.muted
    ? "fas fa-volume-xmark"
    : "fa-solid fa-volume-high";
  volumeRange.value = video.muted ? 0 : volumeValue;
};
const handleVolume = (event) => {
  const {
    target: {value},
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.classList = "fa-solid fa-volume-high";
  }
  if (volumeRange.value == 0) {
    video.muted = true;
    muteBtn.classList = "fas fa-volume-xmark";
  } else {
    video.muted = false;
    muteBtn.classList = "fa-solid fa-volume-high";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(11, 19);
const handleLoadedMeta = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeLine.max = Math.floor(video.duration);
};
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeLine.value = Math.floor(video.currentTime);
};

const handelTimeChange = (event) => {
  const {
    target: {value},
  } = event;
  video.currentTime = value;
};
const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenBtn.classList = "fas fa-maximize";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.classList = "fas fa-minimize";
  }
};

const hideControls = () => {
  videoControls.classList.remove("showing");
};
const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovement) {
    clearTimeout(controlsMovement);
    controlsMovement = null;
  }
  videoControls.classList.add("showing");
  controlsMovement = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

//코드첼린지 스페이스바 나 엔터 화면클릭으로 영상의 플레이와 퍼즈를 구현

const handleEnded = () => {
  const {id} = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {method: "POST"});
};

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolume);
video.addEventListener("loadedmetadata", handleLoadedMeta);
video.addEventListener("timeupdate", handleTimeUpdate);
timeLine.addEventListener("input", handelTimeChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("ended", handleEnded);
