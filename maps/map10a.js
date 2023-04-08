var map = {
  wave: 0,
background: "room1",
  init: function() {
    // a.e();
    this.spawn_wave();
  },
  spawn_wave: function() {
    if (enemies.length == 0) {
      this.wave += 1;
      a.wave_msg(this.wave);
    } else {
      return;
    }

    switch(this.wave) {
      case 1:

        a.e(670, -300, [weapons.pendulum(), weapons.pendulum(1, Math.PI/2)], 1.5, 0.8, null, 900);
        a.e(670, 100, [weapons.pendulum(), weapons.pendulum(1, -Math.PI/2)], 1.5, 0.8, null, 900);
        a.e(670, -400, [weapons.pendulum(), weapons.pendulum(1, Math.PI/2)], 1.5, 0.8, null, 900);

        a.e(670, -500, [weapons.pendulum(), weapons.pendulum(1, Math.PI/2)], 1.5, 0.8, null, 900);
        a.e(670, 300, [weapons.pendulum(), weapons.pendulum(1, -Math.PI/2)], 1.5, 0.8, null, 900);
        a.e(570, 500, [weapons.pendulum(), weapons.pendulum(1, Math.PI/2)], 1.5, 0.8, null, 900);


        a.e(170, -300, [weapons.pendulum(), weapons.pendulum(1, Math.PI/2)], 1.5, 1.8, null, 900);
        a.e(170, 100, [weapons.pendulum(), weapons.pendulum(1, -Math.PI/2)], 1.5, 1.8, null, 900);
        a.e(170, -400, [weapons.pendulum(), weapons.pendulum(1, Math.PI/2)], 1.5, 1.8, null, 900);

        a.e(-240, 440, [weapons.superfast()], 0.5, 4);
        a.e(-140, 440, [weapons.superfast()], 0.5, 4);

        a.e(-240, 240, [weapons.superfast()], 0.5, 4);
        a.e(-140, 240, [weapons.superfast()], 0.5, 4);

        a.e(600+240, 440, [weapons.superfast()], 0.5, 4);
        a.e(600+140, 440, [weapons.superfast()], 0.5, 4);

        a.e(600+240, 240, [weapons.superfast()], 0.5, 4);
        a.e(600+140, 240, [weapons.superfast()], 0.5, 4);
        break;

      case 2:

        a.e(-100, 450, [weapons.shield(1, 0)], 1, 1, null, 700);
        
        a.e(670, -100, [weapons.shield(1, 0), weapons.shield(1, Math.PI/2)], 1, 1, null, 700);

        a.e(-100, 600, [weapons.longsword()], 1, 1, null, 700);
        a.e(600, -100, [weapons.speedsword()], 1, 1, null, 700);

        for (let i=0;i<6;i++) {
          a.e(i*600/6, 500 + (50 * (i%3)), [weapons.pendulum()]);
        }


        a.e(-100, -200, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)], 1.3, 0.9, null, 500);
        a.e(600, -200, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)], 1.3, 0.9, null, 500);


        a.e(500, 500, [weapons.pendulum(1, 0), weapons.pendulum(1, Math.PI/2)], 1.3, 0.9, null, 800);


        break;
      default:
        // code block
        state.set("victory")
    }

  }
}