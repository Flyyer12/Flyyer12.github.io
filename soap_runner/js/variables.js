const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let audioContext = new AudioContext();

let deviceIs = (x) => { return window.navigator.userAgent.indexOf(x) >= 0 };
let isMobile = deviceIs('Android') || deviceIs('iPhone') || false;

var scale;

let heightM;
let widthM;
let side;

function setSize() {

  if (innerHeight < innerWidth) {

    canvas.height = height = innerHeight;
    canvas.width = width = height * 2;
    scale = height / 120;

  } else {

    canvas.width = width = innerWidth;
    canvas.height = height = width / 2;
    scale = width / 240;

  }

  heightM = height / scale;
  widthM = width / scale;

  side = height - 12 * scale;

}

setSize();

var length = 3;

var gameover = false;

var pushPos = 0;
var minPPos = 124;
var maxPPos = 180;

var score = 0;
var bestscore = 0;
let newHi = false;

var jump = true;

var bgs = []
var blocks = [];
var grounds = [];
var particles = [];

var mP = 20;;

var minSpeed = 1;
var maxSpeed = 3;
var speed = 0;

var speedup = false;
var lastSpeed = 0;

var player;
var ground;
var cp;

var gap = 0;

var tBFgap = 7;
var numBFgap = 0;

var state = "home";

var initCount = 0;
var initDate = 0;

let maxTime = 3 * 60000;
let totalTime = 0;
let time = 0;
let lastTime = 0;

let txtAnimCount = 0;
let maxAnimCount = 350;
let moveScreen = true;

let scr = 0;
let hiscr = 0;

var audio = {};

var music;
var musicGain;
var lifes = 3;
var sdk;

var windowLoaded = false;
var soundsLoaded = false;

var addErrorTxt = "";

let RG = new Image();
RG.src = './images/rg.png';

RG.onload = (e)=> {
  ctx.drawImage(RG, (width / 2) - 63 * scale, (height / 2) - 50 * scale, 120 * scale, 60 * scale);
  ctx.textAlign = 'center';
  ctx.textBaseLine = 'center';
  ctx.fillStyle = 'white';
  ctx.font = 12 * scale + "px Cursive";
  ctx.fillText('Loading...', (width / 2), (height / 2) + 30 * scale);
}
