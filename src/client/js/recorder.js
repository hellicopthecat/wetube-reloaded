//https://developer.mozilla.org/ko/docs/Web/API/MediaDevices/getUserMedia
//npm i regenerator-runtime

const {async} = require("regenerator-runtime");

const startBtn = document.getElementById("startBtn");
const videoView = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownLoad = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "recorded_Video.webm";
  document.body.appendChild(a);
  a.click();
};
const handleStop = () => {
  startBtn.innerText = "Dowload Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownLoad);
  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    //createObjectURL은 브라우저 메모리에서만 가능한 URL을 만들어준다.
    videoView.srcObject = null;
    videoView.src = videoFile;
    videoView.play();
  };

  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {width: 200, height: 100},
  });
  videoView.srcObject = stream;
  //srcObj = videoView가 가질수 있는 무언가. mediastream, mediasource, blob, file을 실행할 때
  //srcObj에 주는 무언가를 의미
  videoView.play();
};
init();

startBtn.addEventListener("click", handleStart);
