var main, audio, context, analyser, src, array, logo, file;
var playbtn, stopbtn, pausebtn, openbtn, closebtn, volume;
var timebar, start, slider, visualizer, pic;
var controlPanel, musicPanel, openMenu, openBar;
var optionCircle, optionVisible, optionPicture;
var vis, mask, loader, staticPictureSizeW;


start = undefined;
main = document.getElementById('main');
visualizer = document.getElementById('visualizer');
picture = document.getElementById('picture');
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
mask = document.getElementById('mask');
loader = document.getElementById('loader');

timebar = document.getElementById('timebar');
optionCircle = document.getElementById('circle');
optionVisible = document.getElementById('visual');
optionPicture = document.getElementById('pic');

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
            console.log(file.files);
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
        if(audio.currentTime == 0) {
            preparation();
            //var files = file.files;
            //console.log(file.files);
            //audio.src = URL.createObjectURL(files[0]);
            audio.crossOrigin="anonymous"
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
        //alert('No file selected');
        //audio.load();
        //audio.play();
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
        //openMenu.innerHTML = '&#129094;'
        document.querySelector('.arrowUp').classList.add('active');
        document.querySelector('.arrowDown').classList.add('active');
        main.classList.add('activeX');
        controlPanel.classList.add('activeX');
    }
    else {
       //openMenu.innerHTML = '&#129092;';
        main.classList.remove('activeX');
        document.querySelector('.arrowUp').classList.remove('active');
        document.querySelector('.arrowDown').classList.remove('active');
        controlPanel.classList.remove('activeX');
    }
}

openBar.onclick = function() {
    controlPanel.classList.toggle('active');
    if(controlPanel.classList.contains('active')) {
        //openBar.innerHTML = '&#129095';
        document.querySelector('.arrowLeft').classList.add('active');
        document.querySelector('.arrowRight').classList.add('active');
    }
    else {
        //openBar.innerHTML = '&#129093';
        document.querySelector('.arrowLeft').classList.remove('active');
        document.querySelector('.arrowRight').classList.remove('active');
    }
}

volume.oninput = function() {
    audio.volume = volume.value/100;
}

slider.oninput = function() {
    audio.currentTime = this.value;
}

optionCircle.onclick = function() {
    if(optionCircle.checked == true) {
        logo.visibility = 'visible';
    }
    else {
        logo.visibility = 'hidden';
    }
}

optionVisible.onclick = function() {
    if(optionVisible.checked == true) {
        visualizer.style.visibility = 'visible';
    }
    else {
        visualizer.style.visibility = 'hidden';
    }
}

optionPicture.onclick = function() {
    if(optionPicture.checked == true) {
        picture.style.visibility = 'visible';
    }
    else {
        picture.style.visibility = 'hidden';
    }
}

window.onload = function() {
    loader.style.display = 'none';
    mask.style.display = 'none';
    staticPictureSizeW = document.body.clientWidth;
    audio.currentSrc = 'music/music1.mp3';
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


for(var i=0; i<160; i++) {
    var vis = document.createElement('div');
    vis.setAttribute('id', 'num'+i);
    vis.setAttribute('class', 'strip');
    vis.style.left = (12 * i) + 'px';
    visualizer.append(vis);
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

    //???????????? ?? ??????????????
    timebar.innerHTML = durationTime(parseInt(audio.currentTime)) + " / " + durationTime(audio.duration);
    
    for(var i=0; i<160; i++) {
        vis = document.getElementById('num'+i);
        vis.style.height = array[i] + 'px';
        vis.style.backgroundColor = 'rgb('+(array[i]+array[i])+','+(array[i]-100)+','+(array[i]+200)+')';
    }
    picture.style.width = staticPictureSizeW + array[0] + 'px';

    switch(true) {
        case(array[0] >= 50 && array[0] < 100):
            logo.backgroundColor = 'rgb('+(array[40] - 150)+','+(array[40]+20)+','+(array[40]-45)+')'
            logo.opacity = '0.3';
            break;

        case(array[0] >= 100 && array[0] <= 200):
            logo.backgroundColor = 'rgb(0,0,205)';
            logo.opacity = '0.5';
            break;
        
        case(array[0] > 200):
            logo.backgroundColor = 'rgb('+(array[40]+199)+',21,133)';
            logo.opacity = '0.7';
            break;
        
        default:
            break;
    }
            

    logo.height = (array[0]) + 'px';
    logo.width = (array[0]) + 'px';
    //logo.backgroundColor = 'rgb('+(array[40] - 150)+','+(array[40]+20)+','+(array[40]-45)+')';
}

