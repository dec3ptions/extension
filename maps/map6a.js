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
        a.e(600+200, 400+200, [weapons.longsword()]);
        a.e(-100, 400+200, [weapons.longsword()]);

        a.e(-100, -200, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)]);
        a.e(600, -200, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)]);


        a.e(300, 500, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)]);
        a.e(500, 500, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)]);

        a.e(500, 500, [weapons.pendulum(1, 0), weapons.pendulum(1, Math.PI/2)]);
        a.e(200, 500, [weapons.pendulum(1, 0), weapons.pendulum(1, Math.PI/2)]);
        
        a.e(500, 500, [weapons.tiny_fast_dagger()], 0.5, 3.5);
        a.e(400, 450, [weapons.tiny_fast_dagger()], 0.5, 3.5);

        break;

      case 2:
        for (let i=0;i<6;i++) {
          a.e(i*600/4 - 100, 600 + (50 * (i%3)), [weapons.pendulum()], 0.5, 3.5, null, 350);
          a.e(i*600/4 - 100, 500 + (50 * (i%3)), [weapons.tiny_fast_dagger()], 0.5, 3.5, null, 10);
        }
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}