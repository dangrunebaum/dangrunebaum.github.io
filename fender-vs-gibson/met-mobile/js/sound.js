//sound comparison page, mobile version 

let samples;
let playSoundBrand = null;

function preload() {
    //create samples objects 
    samples = {
        fender: {
            fft: null,
            top: 10,
            left: 23,
            sound: loadSound('sound/fender_sample.mp3')
        },
        gibson: {
            fft: null,
            top: 210,
            left: 23,
            sound: loadSound('sound/gibson_sample.mp3')
        }
    }
}

function setup() {

    let cnv = createCanvas(200, 375);
    cnv.parent("canvas");
    background(0);

    samples.fender.fft = new p5.FFT();
    samples.fender.sound.amp(0.2);
    samples.gibson.fft = new p5.FFT();
    samples.gibson.sound.amp(0.2);

    //rectangles around sound samples  
    stroke(255);
    strokeWeight(2);
    fill(0);
    rect(20, 10, 150, 150);
    rect(20, 210, 150, 150);

    //text and lines inside sound squares 
    textFont("Futura");
    noStroke();
    textSize(12);
    textAlign(LEFT);
    fill(255);
    text('Click to play/pause \nFender Stratocaster', 27, 30);
    text('Click to play/pause \nGibson Les Paul', 27, 230);
    strokeWeight(1);
    stroke(221, 105, 103);
    line(23, 85, 166, 85);
    line(23, 285, 166, 285);
}

function mouseClicked() {

    // mouse positions for sound interactions  
    if (mouseX >= 20 && mouseX <= 220) {
        if (mouseY >= 10 && mouseY <= 160) {
            togglePlay("fender");
            stroke(162, 224, 184);
            strokeWeight(6);
        }
        else if (mouseY >= 210 && mouseY <= 360) {
            togglePlay("gibson");
            stroke(183, 132, 67);
            strokeWeight(6);
        }
    }
}

//FFT analyzer functions 
function draw() {

    if (playSoundBrand === null) return;
    let sample = samples[playSoundBrand];
    let spectrum = sample.fft.analyze();
    noStroke();
    fill(0, 73, 219); // audio frequency spectrum is blue
    for (var i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, 0, 150);
        let h = -150 + map(spectrum[i], 0, 255, 150, 0);
        rect(x + sample.left, 147 + sample.top, 150 / spectrum.length, h);
    }

    let waveform = sample.fft.waveform();
    noFill();
    beginShape();
    stroke(221, 105, 103); // amplitude waveform is red
    strokeWeight(1);
    for (var i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, 144);
        let y = map(waveform[i], -1, 1, 0, 144);
        vertex(x + sample.left, y + sample.top);
    }
    endShape();
}

// fade sound if mouse is over canvas
function togglePlay(brand) {
    let sound = samples[brand].sound;
    if (playSoundBrand !== null) {
        if (sound.isPlaying()) {
            sound.pause();
            playSoundBrand = null;
        }
    } else {
        playSoundBrand = brand;
        sound.loop();
    }
}