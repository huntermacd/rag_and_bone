var ctx = new (window.AudioContext || window.webkitAudioContext)();

// unlock audio context for iOS :(

window.addEventListener('touchstart', function() {
    var buffer = ctx.createBuffer(1, 1, 22050);
    var source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.noteOn(0);
}, false);

// setup

var button = document.getElementById('go-to-sleep');
var zs = document.getElementsByClassName('z');

var amp = ctx.createGain();
amp.gain.value = 0;

var filter = ctx.createBiquadFilter();
filter.type = 'bandpass';
filter.frequency.value = 200;

// noise

var bufferSize = 4096;
var whiteNoise = ctx.createScriptProcessor(bufferSize, 1, 1);

whiteNoise.onaudioprocess = function(e) {
    var output = e.outputBuffer.getChannelData(0);

    for (var i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
}

whiteNoise.connect(filter);
filter.connect(amp);
amp.connect(ctx.destination);

// button

button.addEventListener('click', activate, false);

function activate(){
    if (button.dataset.on == 'false'){
        amp.gain.value = 1;
        button.dataset.on = 'true';
        button.src = 'asleep.png';
        document.body.style.backgroundColor = 'black';
        
        for (var i = 0; i < zs.length; i++) {
            zs[i].style.animationPlayState = 'running';
            zs[i].style.visibility = 'visible';
        }
    } else {
        amp.gain.value = 0;
        button.dataset.on = 'false';
        button.src = 'awake.png';
        document.body.style.backgroundColor = 'white';

        for (var i = 0; i < zs.length; i++) {
            zs[i].style.animationPlayState = 'paused';
            zs[i].style.visibility = 'hidden';
        }
    }
}