console.log('hello world!')

// *** Write this in an Electron process? *** //

var audio = document.querySelector('audio');
// var range = document.querySelector('input');

// getUserMedia block - grab stream
// put it into a MediaStreamAudioSourceNode
// also output the visuals into a audio element

if (navigator.mediaDevices) {
    console.log('getUserMedia supported.');
    navigator.mediaDevices.getUserMedia ({audio: true, video: false})
    .then(function(stream) {
        audio.srcObject = stream;
        audio.onloadedmetadata = function(e) {
            audio.play();
            audio.muted = true;
        };

        // Create a MediaStreamAudioSourceNode
        // Feed the HTMLMediaElement into it
        var audioCtx = new AudioContext();
        var source = audioCtx.createMediaStreamSource(stream);

        // Create a biquadfilter
        // var biquadFilter = audioCtx.createBiquadFilter();
/*        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;*/
        // biquadFilter.gain.value = range.value;

        // connect the AudioBufferSourceNode to the gainNode
        // and the gainNode to the destination, so we can play the
        // music and adjust the volume using the mouse cursor
        // source.connect(biquadFilter);
        // biquadFilter.connect(audioCtx.destination);

        source.connect(audioCtx.destination)

        // Get new mouse pointer coordinates when mouse is moved
        // then set new gain value

        // range.oninput = function() {
        //     biquadFilter.gain.value = range.value;
        // }
    })
    .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
} else {
   console.log('getUserMedia not supported on your browser!');
}