//https://developer.mozilla.org/ko/docs/Web/API/MediaDevices/getUserMedia
//npm i regenerator-runtime
import {fetchFile, createFFmpeg} from "@ffmpeg/ffmpeg";
const {async} = require("regenerator-runtime");

const startBtn = document.getElementById("startBtn");
const videoView = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recorded.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};
const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownLoad = async () => {
  startBtn.removeEventListener("click", handleDownLoad);
  startBtn.innerText = "Transcoding..";
  startBtn.disabled = true;
  //https://github.com/ffmpegwasm/ffmpeg.wasm
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);
  const mp4Blob = new Blob([mp4File.buffer], {type: "video/mp4"});
  const thumbBlob = new Blob([thumbFile.buffer], {type: "image/jpg"});
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "recorded.mp4");
  downloadFile(mp4Url, "thumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(videoFile);

  startBtn.disabled = false;
  startBtn.innerText = "Record Again";
  startBtn.addEventListener("click", handleStart);
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
