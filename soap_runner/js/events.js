let startEvent, endEvent;

if (isMobile) {
  startEvent = 'touchstart';
  endEvent = 'touchend'
} else {
  startEvent = 'click';
  endEvent = 'mouseup';
}

onkeydown = (e) => {

  switch (e.keyCode) {

    case 32: {
      if (state == "home") {
        if (settings.active) settings.active = false;
        state = "playing";
        score = 0;
      }
      if (jump && state == "playing" && !pause.active) {
        player.jump();
        jump = false;
      }
    }
    break;

  case 80:
    pauseToggle();
    break;

  default:
    e.preventDefault();
    break;

  }

}


addEventListener(endEvent, () => {
  jump = true;
})

canvas.addEventListener(startEvent, (ev) => {

  if (BlackScreen.gA < 0) {

    let e;

    if (isMobile && ev.touches.length < 2) e = ev.touches[0];
    else if (ev.length < 2) e = ev;


    if (e) {

      if (collideM(e, pause)) pauseToggle();
      if (collideM(e, settings.btn)) settingsToggle();
      if (collideM(e, sounds) && settings.active) {

        playSound(audio.activate);
        if (sounds.active) {
          sounds.active = false;
          music.context.suspend();
        } else {
          sounds.active = true;
          music.context.resume();
        }

        if (pause.active) {
          if (sounds.active) drawBtn2(sounds, 1);
          else drawBtn2(sounds, 0);

        }

      }

      if (isMobile) {
        if (state == "home" && !collideM(e, settings.btn) && !collide(e, settings)) {
          if (!settings.active) {
            initDate = Date.now();
            state = "playing";
            newHi = false;
            score = 0;
          } else if (!collideM(e, settings)) settingsToggle();
        }
        if (jump && state == "playing" && !collideM(e, pause) && !pause.active) {
          player.jump();
          jump = false;
        }
      }

      // add function

      const callbacks = {
        adFinished: () => {
          lifes--;
          state = 'playing';
          music.context.resume();
          anim();
          revive();
        },
        adError: (error) => {
          addErrorTxt = "Error While loading, Try Again";
        },
        adStarted: () => music.context.suspend(),
      };


      if (collideM(e, add) && gameover) {
        playSound(audio.button);

         if (lifes > 0) {
           state = 'ads';
           sdk.ad.requestAd("rewarded", callbacks);
         } else {
           backHome('Too Repairs')
         }

      }
      

    }

  }

})