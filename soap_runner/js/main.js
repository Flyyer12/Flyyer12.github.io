function anim() {

  ctx.imageSmoothingEnabled = false;

  ctx.save();
  ctx.resetTransform();
  ctx.translate(0, 0);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  ctx.fillStyle = '#00f2ff';
  ctx.fillRect(0, 0, width, height);

  bgs.forEach(bg => bg.draw());

  blocks.forEach(bl => bl.draw());
  ground.draw();

  if (state == "playing") {

    if (totalTime < maxTime) {
      totalTime = Date.now() - initDate;
      time = totalTime / maxTime;
    }

    if (time > 1) time = 1;

    blocks.forEach((bl, j) => {

      if (!gameover) bl.x -= speed;

      if (bl.x + bl.width < width && bl.push) {

        numBFgap++;

        if (gap > 0) gap = 0;

        if (numBFgap >= tBFgap) {
          gap = lerp(320, 500, time);
          numBFgap = 0;
          tBFgap = random(7, 13);
        }

        if (time < 1) length = lerp(3, objects.length, time);
        else length = random(3, objects.length)

        var obj = objects[Math.floor(Math.random() * length)];

        blocks.push(new Block(
          bl.x + pushPos,
          ground.y - obj.height * scale,
          obj.width, obj.height, obj.img, obj.k
        ));

        bl.push = false;
      }

      if (player.x + player.width > bl.x + bl.width && bl.add) {

        playSound(audio.scoreitr, 2);
        score++;
        bl.add = false;

      }

      if (bl.x < -bl.width) {

        blocks = arrRemove(j, blocks);

      }

      if (collide(player.box, bl.box) && player.touchable) {

        doSquares(player, Angle(player, bl));

        if (speed > 0) lastSpeed = speed;
        speed = 0;

        if (player.alive) {
          playSound(audio.break, 2);
          player.alive = false;
        }

        if (!gameover) {
          gameover = true;
        }

      }

    })

    if (blocks[blocks.length - 1] != undefined && blocks[blocks.length - 1].x < 0)
      if (speedup) speedup = false;

    speed = lerp(minSpeed, maxSpeed, time) * scale;
    pushPos = (lerp(minPPos, maxPPos, time) - random(0, lerp(40, 60, time)) + gap) * scale;

    fillText2(' ' + score, (width / scale) / 2, 20, "center", "orangered", 'Weymouth');

    if (settings.active) filter('black', 0.5);
    drawBtn(pause);

    if (initCount < 300) {

      initCount++;
      howToPlay();

    }

  }

  bgs.forEach((bg, i) => {

    if (state == "playing" && !gameover) bg.x -= (speed) / 2;
    else if (state == "home") bg.x -= 0.4 * scale;


    if (bg.x <= width && bg.push) {
      spawnBg();
      bg.push = false;
    }

    if (bg.x <= -bg.width) bgs = arrRemove(i, bgs);

  });



  if (state == "home") {

    if (txtAnimCount < maxAnimCount) txtAnimCount++;

    drawBtn(title);

    if (BlackScreen.gA <= 0) {

      if (hiscr < bestscore) {
        playSound(audio.scoreadd, 0.5);
        scr = Math.ceil(lerp(0, score, txtAnimCount / maxAnimCount));
        hiscr = Math.ceil(lerp(0, bestscore, txtAnimCount / maxAnimCount));
      }

      fillText("score", scr, width / 2, 16 * scale, "center", "blue", "Weymouth");
      fillText("hi-score", hiscr, width / 2, 24 * scale, "center", "crimson", "Weymouth");
      if (newHi) fillText2("NEW", (width / scale) / 2 - 55, 24, "center", "white", "Weymouth");


    }

    let playText;

    if (isMobile) playText = 'Touch Screen to Play !';
    else playText = 'Press space to Play !';

    fillText2(playText, (width / scale) / 2, (height / scale) - 20, "center", "white");

    if (settings.active) filter('black', 0.5);
    drawBtn(settings.btn);

  }

  particles.forEach(p => {

    p.draw();
    p.update();

  })

  if (score > bestscore && !newHi) {
    newHi = true;
  }

  if (!gameover) {

    player.draw();
    player.update();

  } else {

    if (add.bar.width === 36) ctx.translate(2 * scale, 2 * scale);

    filter('black',0.5);
    drawBtn(add);
    drawBtn(add.bar);
    fillText2("repair " + lifes, add.x + add.width / 2 + 0.8, add.y + 8, "center", "white");
    if (addErrorTxt != "")fillText2(addErrorTxt, add.x + add.width / 2 + 0.8, add.y + 60, "center", "greenyellow");
    if (add.bar.width >= 35.82) ctx.translate(-1 * scale, -1 * scale);
    if (add.bar.width >= 0) add.bar.width -= 0.18;
    else backHome();

  }


  if (settings.active) {
    drawBtn(settings);
    if (sounds.active) drawBtn2(sounds, 1);
    else drawBtn2(sounds, 0);

    fillText2("sound", sounds.x, sounds.y + sounds.height - 1.2 * scale, "right", "whitesmoke");
    fillText2("Shop Coming Soon !", settings.x + 22.8, sounds.y + sounds.height + 20, "left", "whitesmoke");
    fillText2("", settings.x + 40, sounds.y + sounds.height + 30, "left", "whitesmoke");

  }

  BlackScreen.update();

  if (!gameover && BlackScreen.gA >= 0) player.draw();

  if (!pause.active && state != 'ads') requestAnimationFrame(anim);

}