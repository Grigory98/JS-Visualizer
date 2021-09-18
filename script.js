var main, audio, context, analyser, src, array, logo, file;
var playbtn, stopbtn, pausebtn, openbtn, closebtn, volume;
var timebar, start, slider, visualizer;
var controlPanel, musicPanel, openMenu, openBar;

start = undefined;
main = document.getElementById('main');
visualizer = document.getElementById('visualizer');
file = document.getElementById('audioFile');
logo = document.getElementById('logo').style;
audio = document.getElementById('audio');
controlPanel = document.getElementById('controlPanel');
musicPanel = document.getElementById('musicPanel');

playbtn = document.getElementById('play');
stopbtn = document.getElementById('stop');
pausebtn = document.getElementById('pause');
openMenu = document.getElementById('openMenu');
openBar = document.getElementById('openBar');
volume = document.getElementById('volume');
slider = document.getElementById("myRange");

timebar = document.getElementById('timebar');

file.onchange = function() {
    preparation();
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
}

playbtn.onclick = function() {
    if(file.files.length > 0) {
        if(audio.currentTime == 0) {
            preparation();
            var files = file.files;
            audio.src = URL.createObjectURL(files[0]);
            audio.load();
            audio.play();
        }
        else {
            audio.play();
            requestAnimationFrame(loop);
        }
        pausebtn.classList.toggle('active');
        if(pausebtn.classList.contains('active')) {
            playbtn.style.display = 'none';
            pausebtn.style.display = 'block';
            controlPanel.classList.remove('pauseActive');
        }
        else {
            playbtn.style.display = 'block';
            pausebtn.style.display = 'none';
        }
    }
    else {
        alert('Файл не выбран!');
    }
}

stopbtn.onclick = function() {
    audio.pause();
    audio.currentTime = 0;
    timebar.innerHTML = durationTime(audio.duration);
    cancelAnimationFrame(start);
    controlPanel.classList.remove('pauseActive');
    pausebtn.style.display = 'none';
    playbtn.style.display = 'block';
}

pausebtn.onclick = function() {
    audio.pause();
    cancelAnimationFrame(start);
    pausebtn.classList.toggle('active');
    if(pausebtn.classList.contains('active')) {
        playbtn.style.display = 'none';
        pausebtn.style.display = 'block';
    }
    else {
        playbtn.style.display = 'block';
        pausebtn.style.display = 'none';
        //controlPanel.classList.toggle('pauseActive');
        controlPanel.classList.add('pauseActive');
    }
}

openMenu.onclick = function() {
    musicPanel.classList.toggle('active');
    if(musicPanel.classList.contains('active')) {
        openMenu.innerHTML = '&#129094;';
        main.classList.add('activeX');
        controlPanel.classList.add('activeX');
    }
    else {
        openMenu.innerHTML = '&#129092;';
        main.classList.remove('activeX');
        controlPanel.classList.remove('activeX');
    }
}

openBar.onclick = function() {
    controlPanel.classList.toggle('active');
    if(controlPanel.classList.contains('active')) {
        openBar.innerHTML = '&#129095';
    }
    else {
        openBar.innerHTML = '&#129093';
    }
}

volume.oninput = function() {
    audio.volume = volume.value/100;
}

slider.oninput = function() {
    audio.currentTime = this.value;
}

function preparation() {
    context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(context.destination);
    loop();
}

function durationTime(duration) {
    var time = parseInt(duration);
    var minutes = parseInt(time/60);
    var seconds = time - (minutes*60);
    seconds < 10 ? seconds= "0" + seconds : seconds;
    return minutes + ":" + seconds;
}

function durationTimer(count) {
    var timer = parseInt(audio.duration);
    return durationTime(timer - count);
}

var vis1, vis2, vis3, vis;

for(var i=0; i<160; i++) {
    var vis = document.createElement('div');
    vis.setAttribute('id', 'num'+i);
    vis.setAttribute('class', 'strip');
    vis.style.left = (12 * i) + 'px';
    vis.style.height = '50px';
    visualizer.append(vis);
    console.log(vis);
}

function loop() {
    start = window.requestAnimationFrame(loop);
    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    
    if(audio.currentTime == audio.duration) {
        pausebtn.style.display = 'none';
        playbtn.style.display = 'block';
        audio.currentTime = 0;
        cancelAnimationFrame(start);
    }
    slider.max = parseInt(audio.duration);
    slider.value = audio.currentTime;

    //Минуты и секунды
    timebar.innerHTML = durationTime(parseInt(audio.currentTime)) + " / " + durationTime(audio.duration);
    
    for(var i=0; i<160; i++) {
        vis = document.getElementById('num'+i);
        vis.style.height = array[i] + 'px';
        vis.style.backgroundColor = 'rgb(80, '+(i+80)+', '+(array[i]+50)+')';
    }
    
    logo.height = (array[0]) + 'px';
    logo.width = (array[0]) + 'px';
    logo.backgroundColor = 'rgb('+(array[40] - 150)+','+(array[40]+20)+','+(array[40]-45)+')';
}

