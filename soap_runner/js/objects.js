var sources = [
  [
    "./images/player/soap/soap.png"
  ],
  [
    "./images/backgrounds/house.png",
    "./images/backgrounds/restaurant.png"
  ],
  [
    "./images/objects/box.png",
    "./images/objects/drone.png",
    "./images/objects/radio.png",
    "./images/objects/milk.png",
    "./images/objects/rubix.png",
    "./images/objects/copter.png",
    "./images/objects/three.png",
  ]
]

var BlackScreen = {
  gA: 3,
  sGa: -1 / 30,
  color: 'black',
  txt: 'LOADING',
  foo: null,
  launch: true,
  update: function() {
    if (this.gA < 0 || this.gA > 3) this.sGa = -this.sGa;
    if (this.gA >= 0) {
      ctx.save();
      if (this.sGa > 0) this.gA += this.sGa * 2;
      else this.gA += this.sGa;
      if (this.gA >= 1 && this.foo && this.launch) {
        this.launch = false;
        this.foo();
      }
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.gA;
      if (this.gA > 0) {
        ctx.fillRect(0, 0, width, height);
        fillText2(this.txt, (width / scale) / 2, (height / scale) / 2, 'center', 'white');
      }
      ctx.restore();
    }
  }
}

var backgrounds = [

  {
    width: 240,
    height: 87,
    },
  {
    width: 240,
    height: 87,
    }

];

var objects = [
  {
    width: 20,
    height: 19,
    k: {
      x: 5,
      y: 0,
      width: -5 * 2,
      height: 0
    }
    },
  {
    width: 21,
    height: 30,
    k: {
      x: 0,
      y: 3,
      width: 0,
      height: -22
    }
    },

  {
    width: 31,
    height: 20,
    k: {
      x: 0,
      y: 4,
      width: 0,
      height: -4
    }
    }, {
    width: 26,
    height: 32,
    k: {
      x: 0,
      y: 4,
      width: 0,
      height: -4
    }
    }, {
    width: 10,
    height: 10,
    k: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
    },
  {
    width: 32,
    height: 48,
    k: {
      x: 0,
      y: 0,
      width: 0,
      height: -20
    }
    },
  {
    width: 40,
    height: 10,
    k: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
    }
];

var players = {
  soap: {
    width: 16,
    height: 8,
  }
}

function setUpSources(a, j) {
  for (let i = 0; i < a.length; i++) {
    let t = a[i];
    t.img = new Image();
    t.img.src = sources[j][i];
  }
}

function setUpSources2(a, j) {
  let arr = Object.keys(a);
  for (let i = 0; i < arr.length; i++) {
    a[arr[i]].img = new Image();
    a[arr[i]].img.src = sources[j][i];
  }
}

setUpSources2(players, 0);
setUpSources(backgrounds, 1);
setUpSources(objects, 2);

var pause = {

  active: false,
  img: new Image(),
  x: (width / scale) - 12,
  y: 0,
  width: 12,
  height: 12

}

var settings = {

  btn: {

    img: new Image(),
    x: 1,
    y: 1,
    width: 12,
    height: 12

  },

  active: false,
  img: new Image(),
  x: (width / scale) / 2,
  y: (height / scale) / 2,
  width: 120,
  height: 68

}

var add = {

  img: new Image(),
  x: widthM / 2 - 48 / 2,
  y: heightM / 2 - 40 / 2,
  width: 48,
  height: 40,

}

add.bar = {
  img: new Image,
  x: add.x + 6,
  y: add.y + add.height - 9,
  width: 36,
  height: 5
}

settings.x -= settings.width / 2;
settings.y -= settings.height / 2;

var sounds = {

  img: new Image(),
  active: true,
  x: settings.x + 40,
  y: settings.y + 8,
  width: 8,
  height: 8

}

var how = {

  img: new Image(),
  x: 0,
  y: 0,
  width: 240,
  height: 120

}

var title = {
  img: new Image(),
  x: (width / scale) / 2,
  y: (height / scale) / 2,
  width: 84,
  height: 51
}

title.x -= title.width / 2;
title.y -= title.height / 2;

title.img.src = "./images/title.png";
if (isMobile) how.img.src = "./images/how2.png";
else how.img.src = "./images/how.png";
pause.img.src = "./images/pause.png";
sounds.img.src = "./images/active.png"
settings.btn.img.src = "./images/settings_btn.png";
settings.img.src = "./images/settings.png";
add.img.src = "./images/add.png"
add.bar.img.src = "./images/bar.png";