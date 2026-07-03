function save(k, v) {

  let txt = crypt('paos', v);
  sdk.data.setItem(k, JSON.stringify(txt));

}

function load(k) {

  let txt = JSON.parse(sdk.data.getItem(k));

  try {
    return decrypt('paos', txt);
  } catch {
    return null;
  }

}

function init() {

  addErrorTxt = "";
  try {
    sdk = window.CrazyGames.SDK;
    sdk.init();
  } catch {
    ctx.clearRect(0, 0, width, height);
    ctx.textAlign = 'center';
    ctx.textBaseLine = 'center';
    ctx.fillStyle = 'white';
    ctx.font = 12 * scale + "px Cursive";
    ctx.fillText('Check Your Internet Connection !', (width / 2), (height / 2));

    setTimeout(() => location.reload(), 4000);
  }
  lifes = 3;
  moveScreen = true;
  txtAnimCount = 0;
  initCount = 0;
  length = 3;
  initDate = Date.now();
  time = 0;
  totalTime = 0;
  lastTime = 0;
  scr = hiscr = 0;

  add.bar.width = 36;
  speed = minSpeed;
  pushPos = width - 20 * scale;

  maxScore = 10;

  if (load("runnersoapbs") != undefined) {
    bestscore = load("runnersoapbs");
    if (isNaN(bestscore)) {
      bestscore = 0;
      save('runnersoapbs', bestscore);
    }
  } else bestscore = 0;

  jump = true;
  gameover = false;

  bgs = []
  blocks = [];
  grounds = [];
  particles = [];

  mP = 20;;

  speedup = false;

  cp = players.soap;

  player = new Player(20, side - cp.height, cp.width, cp.height, cp.img);
  ground = new Ground(0, side / scale, 240, 13);
  bgs[0] = new Background(0, (ground.y / scale) - backgrounds[0].height, backgrounds[0].width, backgrounds[0].height, backgrounds[0].img);

  var obj = objects[Math.floor(Math.random() * length)];

  blocks[0] = new Block(
    width + pushPos,
    ground.y - obj.height * scale,
    obj.width,
    obj.height,
    obj.img,
    obj.k
  );

}

function drawBtn(elem) {
  ctx.drawImage(elem.img, elem.x * scale, elem.y * scale, elem.width * scale, elem.height * scale);
}

function drawBtn2(elem, index) {
  ctx.drawImage(elem.img, (elem.img.width / 2) * index, 0, elem.img.width / 2, elem.img.height, elem.x * scale, elem.y * scale, elem.width * scale, elem.height * scale);
}

function spawnBg() {
  var bg = bgs[bgs.length - 1];
  var newbg = backgrounds[Math.floor((Math.random() * backgrounds.length))];
  bgs.push(new Background((bg.x + bg.width) / scale, (side / scale) - newbg.height, newbg.width, newbg.height, newbg.img));
}

function lerp(a, b, n) {
  return a + (b - a) * n;
}

function random(a, b) {
  return a + Math.random() * (b - a);
}

function fillText(k, v, x, y, al, color, f) {

  let font = f || 'Pixelos';
  if (color != undefined) ctx.fillStyle = color;
  if (al != undefined) ctx.textAlign = al;
  ctx.font = 8 * scale + "px " + font;
  ctx.fillText(k + ": " + v, x, y);

}

function fillText2(k, x, y, al, color, f) {

  let font = f || 'Pixelos';
  if (color != undefined) ctx.fillStyle = color;
  if (al != undefined) ctx.textAlign = al;
  ctx.font = 8 * scale + "px " + font;
  ctx.fillText(k.concat(" "), x * scale, y * scale);

}

function collide(a, b) {

  if (
    a.x + a.width >= b.x && a.x <= b.x + b.width &&
    a.y + a.height >= b.y && a.y <= b.y + b.height
  ) return true;

}

function arrRemove(i, arr) {
  let a = arr.slice(0, i);
  let b = arr.slice(i + 1, arr.length);
  return a.concat(b);
}

function Angle(a, b) {

  var Ac = {

    x: a.x + a.width / 2,
    y: a.y + a.height / 2

  }

  var Bc = {

    x: b.x + b.width / 2,
    y: b.y + b.height / 2

  }

  var dx = Ac.x - Bc.x;
  var dy = Ac.y - Bc.y;

  var angle = Math.atan2(dy, dx);

  return angle;

}

function doSquares(pl, angle) {
  if (particles.length < mP) {
    for (let i = 0; i < mP; i++) {
      particles.push(new Particle(pl.x + Math.random() * pl.width, pl.y + Math.random() * pl.height, angle));
    }
  }
}

function collideM(e, elem) {

  var ev = {
    x: e.clientX - canvas.getBoundingClientRect().x,
    y: e.clientY - canvas.getBoundingClientRect().y
  }

  if (
    BlackScreen.gA < 0 &&
    ev.x >= elem.x * scale && ev.x <= elem.x * scale + elem.width * scale &&
    ev.y >= elem.y * scale && ev.y <= elem.y * scale + elem.height * scale
  ) return true;

}



function pauseToggle() {

  if (state == "playing") {

    if (pause.active) {
      playSound(audio.pauseoff);
      musicGain.gain.value = 1;
      initDate = Date.now() - lastTime;
      pause.active = false;
      settings.active = false;
      anim();
    } else {
      lastTime = totalTime;
      if (player.alive) {
        playSound(audio.pauseon);
        musicGain.gain.value = 0.5;
        pause.active = true;
        settings.active = true;
      }
    }

  }

}

function settingsToggle() {


  if (state == "home") {
    playSound(audio.button);
    if (settings.active) settings.active = false;
    else settings.active = true;
  }

}

function howToPlay() {

  fillText2("ground", widthM / 4 + 10.2 * scale, heightM / 2 - 22, "center", "#9B9B9B");
  fillText2("air", widthM / 1.43, heightM / 2 - 22, "center", "#9B9B9B");
  drawBtn(how);
  //fillText2("press space bar",width/2,height/2,"center","grey");
  fillText2("jump", widthM / 4 + 15.2, heightM / 2 + 22, "center", "#9B9B9B");
  fillText2("dash down", widthM / 1.43, heightM / 2 + 22, "center", "#9B9B9B");

}

function blackScreen(c, f, txt) {
  if (BlackScreen.gA < 0) {
    BlackScreen.launch = true;
    BlackScreen.gA = 0;
    BlackScreen.sGa = Math.abs(BlackScreen.sGa);
    BlackScreen.foo = f;
    BlackScreen.color = c || 'black';
    BlackScreen.txt = txt || 'LOADING';
  }
}

function filter(c, gA) {
  ctx.save();
  ctx.fillStyle = c || 'black';
  ctx.globalAlpha = gA;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function run() {
  init();
  anim();
}

async function loadSound(path) {
  const response = await fetch(path);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

async function preloadsSounds() {

  audio.jump = await loadSound('./audio/jump.wav');
  audio.dash = await loadSound('./audio/dash.wav');
  audio.pauseon = await loadSound('./audio/pauseon.wav');
  audio.pauseoff = await loadSound('./audio/pauseoff.wav');
  audio.button = await loadSound('./audio/button.wav');
  audio.activate = await loadSound('./audio/activate.wav');
  audio.break = await loadSound('./audio/break.wav');
  audio.scoreadd = await loadSound('./audio/scoreadd.wav');
  audio.repair = await loadSound('./audio/repair.wav');
  audio.scoreitr = await loadSound('./audio/scoreitr.wav');
  audio.music = await loadSound('./audio/music.wav');

  function lastMusic(buffer = audio.music) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    const gain = audioContext.createGain();
    gain.gain.value = 1;
    source.connect(gain);
    gain.connect(audioContext.destination);
    musicGain = gain;
    music = source;
  }

  if (!soundsLoaded) {
    soundsLoaded = true;

    lastMusic();
    music.loop = true;
    music.start();

  }

}

preloadsSounds();

window.onload = () => {
  windowLoaded = true;
  run();
}

function playSound(buffer, volume = 1) {
  if (sounds.active) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    const gain = audioContext.createGain();
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(audioContext.destination);
    source.start();
  }
}

function revive() {
  blackScreen('white', function() {
    playSound(audio.repair, 2);
    particles = [];
    player.touchable = false;
    player.count = 0;
    if (gameover) gameover = false;
    speed = lastSpeed;
    blocks.forEach(bl => bl.speed = speed);
    player.alive = true;
    player.gA = 1;
    add.bar.width = 36;

  }, " ")
}

function backHome(txt = '') {
  blackScreen('black', function() {
    state = "home";
    if (score > bestscore) bestscore = score;
    save("runnersoapbs", bestscore.toString());
    init();
  }, txt)
}