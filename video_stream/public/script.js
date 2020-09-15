const socket = io("/");

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");

var peer = new Peer(undefined, {
  host: "localhost",
  path: "/peerjs",
  port: 9000,
});

let myVideoStream;
const initMyVideoStream = () => {
  //Connect Peer
  peer.on("open", (peerId) => {
    console.log("peer on... " + ROOM_ID + " " + peerId);
    socket.emit("join-room", ROOM_ID, peerId);
  });

  var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      myVideoStream = stream;
      addVideoStream(myVideo, stream);

      peer.on("call", function (call) {
        call.answer(myVideoStream); // Answer the call with an A/V stream.
        call.on("stream", function (remoteStream) {
          addVideoStream(document.createElement("video"), remoteStream);
        });
      });
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
};
initMyVideoStream();

socket.on("user-connected", (userId) => {
  callAnotherPeerUser(userId);
});

const callAnotherPeerUser = (userId) => {
  var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      var call = peer.call(userId, stream);
      call.on("stream", function (remoteStream) {
        const remoteUserVideo = document.createElement("video");
        //myVideo.muted = true;
        addVideoStream(remoteUserVideo, remoteStream);
      });
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
