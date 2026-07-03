class Streak {

  constructor(x, y) {

    this.x = x;
    this.y = y;
    this.width = 16 * scale;
    this.height = 3 * scale;

    this.img = new Image();
    this.img.src = "./images/player/soap/spreak.png";

    this.push = true;

  }

  draw() {
    if (this.x > -this.width) ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x -= speed;
  }

}

class Player {

  constructor(x, y, width, height, img) {

    // coor 

    this.x = x * scale;
    this.y = y * scale;
    this.width = width * scale;
    this.height = height * scale;

    // physics

    this.gravity = 0.12 * scale;
    this.velocity = 0;

    this.angle = 0;

    this.box = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }

    this.alive = true;
    this.touchable = true;
    this.gA = 1;
    this.invTime = 550;
    this.gas = 1 / 20;
    
    this.dsh = false;

    this.count = 0;

    //draw

    this.img = img;

    this.streaks = [
            new Streak(this.x, this.y + this.height)
        ];

    this.dash = [];

  }

  draw() {

    this.box = {
      x: this.x + (35 / 100) * this.width,
      y: this.y,
      width: (30 / 100) * this.width,
      height: this.height
    }

    if (this.touchable) this.gA = 1;
    else {

      this.gA -= this.gas;
      if (this.gA < 0.1 || this.gA > 0.9) this.gas *= -1;
      if (this.count < this.invTime) this.count++;
      if (this.count < this.invTime - 200) this.gA = 0.6;
      if (this.count >= this.invTime) this.touchable = true;

    }

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(-this.angle * Math.PI / 180);
    ctx.globalAlpha = this.gA;
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();

    //ctx.strokeStyle = 'red';
    //ctx.strokeRect(this.box.x,this.box.y,this.box.width,this.box.height)

  }

  jump() {
    if (this.y == side - this.height) {
      playSound(audio.jump,5);
      this.velocity = -3.6 * scale;
    } else {
      playSound(audio.dash,2);
      this.velocity = 5 * scale;
      this.dsh = true;
    }
  }

  doStreak() {
    this.streaks.forEach((sp, i) => {
      sp.draw();
      sp.update();
      if (sp.x <= this.x && sp.push && this.y >= side - this.height && speed > 0) {
        sp.push = false;
        this.streaks.push(new Streak(this.x, this.y + this.height));
      }
      if (sp.x < -800 * scale) this.streaks = arrRemove(i, this.streaks);
    })
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.y + this.height > side) {
      this.dsh = false;
      this.velocity = 0;
      this.y = side - this.height;
      if (this.angle < -135) this.angle = 180;
      else if (this.angle < 0) this.angle = 0;
    }
    if (this.velocity > 0) this.angle -= this.velocity / scale / 0.55;
    else if (this.velocity < 0) this.angle += this.velocity / scale / 0.55;
    this.doStreak();
    
    if (this.dsh) {
      this.dash.push({
        x: this.x + this.width/2,
        y: this.y + this.height/2,
        w: this.width/2,
        h: this.height/2,
        ang: this.angle,
        gA: 1
      })
    }

    for (let i in this.dash) {
      let d = this.dash[i];
      d.w -= (i/(this.dash.length-1))*0.9*scale;
      //d.x -= speed/4;

      if (d.w >= 0) {

        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.fillStyle = 'orange';
        ctx.globalAlpha = lerp(0.1,0.9,i/(this.dash.length-1));
        ctx.fillRect(-d.w/2,-d.h/2,d.w,d.h);
        ctx.restore();

      } else arrRemove(i,this.dash);

    }
    

  }

}

class Block {

  constructor(x, y, width, height, img, k) {
    this.x = x;
    this.y = y;
    this.width = width * scale;
    this.height = height * scale;
    this.k = k;
    this.box = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
    this.push = true;
    this.add = true;
    this.img = img;
  }

  draw() {

    this.box = {
      x: this.x + this.k.x * scale,
      y: this.y + this.k.y * scale,
      width: this.width + this.k.width * scale,
      height: this.height + this.k.height * scale
    }
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    //ctx.strokeRect(this.box.x,this.box.y,this.box.width,this.box.height);

  }

}

class Ground {

  constructor(x, y, width, height) {
    this.x = x * scale;
    this.y = y * scale;
    this.width = width * scale;
    this.height = height * scale;
    this.img = new Image();
    this.img.src = "./images/ground.png";
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

}

class Background {
  constructor(x, y, width, height, img) {
    this.x = x * scale;
    this.y = y * scale;
    this.width = width * scale;
    this.height = height * scale;
    this.push = true;
    this.img = img;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

}

let PIMG = new Image();
PIMG.src = "./images/player/soap/particles/10.png";

class Particle {

  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.size = 4; //5 * Math.floor(random(1, 2));
    this.width = this.height = this.size * scale;
    this.speed = Math.random() * speed * 2;
    this.angle = angle - Math.PI / 4 + Math.random() * Math.PI / 2;
    this.gravity = 1 * scale;
    this.velocity = 0;
    this.move = false;
    this.bounds = 0;
    this.img = PIMG;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  update() {

    this.x += Math.cos(this.angle) * this.speed;
    if (this.bounds < 2) this.y += Math.sin(this.angle) * this.speed;

    if (this.speed > 0) this.speed -= 0.05
    else if (this.speed < 0) this.speed = 0;

    if (this.move) {

      this.y += Math.sin(this.angle) * this.speed;

    }

    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y + this.height > side) {

      if (this.bounds < 2) {
        this.velocity = -this.velocity * 0.5;
        this.bounds++;
      } else {
        this.velocity = 0;
        this.gravity = 0;
      }

      this.y = side - this.height;
      this.move = false;

    }

  }

}