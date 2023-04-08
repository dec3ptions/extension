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
        // code block
        a.e(600+200, 400+200, [weapons.longsword()], 1.3, 0.9, null, 800);
        a.e(300, 500, [weapons.short_dagger()], 1.3, 0.9, null, 800);
        a.e(300, 500, [weapons.short_dagger()], 1.3, 0.9, null, 800);

        a.e(-100, 200, [weapons.longsword()], 1.3, 0.9, null, 800);

        a.e(-100, -200, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)], 1.3, 0.9, null, 500);
        a.e(600, -200, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)], 1.3, 0.9, null, 500);


        a.e(500, 500, [weapons.pendulum(1, 0), weapons.pendulum(1, Math.PI/2)], 1.3, 0.9, null, 800);


        break;

      case 2:
        for (let i=0;i<5;i++) {
          a.e(i*600/3 - 100, 400 + (50 * (i%3)), [weapons.pendulum()], 1.2, 0.5, null, 900);
        }
        for (let i=0;i<5;i++) {
          a.e(i*600/3 - 100, -100 + (50 * (i%3)), [weapons.pendulum()], 1.2, 0.5, null, 900);
        }
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}