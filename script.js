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

var amp = ctx.createGain();
amp.gain.value = 0;

var num = Math.floor((Math.random() * 3) + 1);

// noises

switch (num){
    case 1: // white
        var bufferSize = 4096;
        var whiteNoise = ctx.createScriptProcessor(bufferSize, 1, 1);

        whiteNoise.onaudioprocess = function(e) {
            var output = e.outputBuffer.getChannelData(0);

            for (var i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        }

        whiteNoise.connect(amp);
        amp.connect(ctx.destination);

        button.style.backgroundColor = 'white';
        break;
    case 2: // pink
        var bufferSize = 4096;
        var pinkNoise = (function() {
            var b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            var node = ctx.createScriptProcessor(bufferSize, 1, 1);
            node.onaudioprocess = function(e) {
                var output = e.outputBuffer.getChannelData(0);
                for (var i = 0; i < bufferSize; i++) {
                    var white = Math.random() * 2 - 1;
                    b0 = 0.99886 * b0 + white * 0.0555179;
                    b1 = 0.99332 * b1 + white * 0.0750759;
                    b2 = 0.96900 * b2 + white * 0.1538520;
                    b3 = 0.86650 * b3 + white * 0.3104856;
                    b4 = 0.55000 * b4 + white * 0.5329522;
                    b5 = -0.7616 * b5 - white * 0.0168980;
                    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                    output[i] *= 0.11; // (roughly) compensate for gain
                    b6 = white * 0.115926;
                }
            }
            return node;
        })();

        pinkNoise.connect(amp);
        amp.connect(ctx.destination);

        button.style.backgroundColor = 'hotpink';
        button.style.color = '#';
        break;
    case 3: // brown
        var bufferSize = 4096;
        var brownNoise = (function() {
            var lastOut = 0.0;
            var node = ctx.createScriptProcessor(bufferSize, 1, 1);
            node.onaudioprocess = function(e) {
                var output = e.outputBuffer.getChannelData(0);
                for (var i = 0; i < bufferSize; i++) {
                    var white = Math.random() * 2 - 1;
                    output[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = output[i];
                    output[i] *= 3.5; // (roughly) compensate for gain
                }
            }
            return node;
        })();

        brownNoise.connect(amp);
        amp.connect(ctx.destination);

        button.style.backgroundColor = 'saddlebrown';
        button.style.color = 'white';
        break;
}

// button

button.addEventListener('click', activate, false);

function activate(){
    if (button.innerHTML == 'Go to Sleep'){
        amp.gain.value = 1;
        button.innerHTML = 'Wake Up';
    } else {
        amp.gain.value = 0;
        button.innerHTML = 'Go to Sleep';
    }
}