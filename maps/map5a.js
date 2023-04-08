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
        a.e(-100, 450, [weapons.shield(1, 0), weapons.longsword(1, Math.PI/2)]);
        
        a.e(670, -100, [weapons.shield(1, 0), weapons.shield(1, Math.PI/2)]);

        // a.e(600+100, 400+100, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI)]);

        for (let i=0;i<4;i++) {
          a.e(i*600/6, 500 + (50 * (i%3)), [weapons.pendulum()]);
        }
        break;
      case 2:
        // code block


        for (let i=0;i<4;i++) {
          a.e(i*600/6, -200 + (50 * (i%3)), [weapons.pendulum()]);
        }

        a.e(670, -300, [weapons.short_dagger(1, 0), weapons.shield(1, Math.PI/2)]);
        a.e(670, 100, [weapons.shield(1, 0), weapons.short_dagger(1, -Math.PI/2)]);

        // a.e(800, -100, [weapons.pendulum()]);
        // a.e(-40, 100, [weapons.pendulum()]);

        a.e(600+100, 400+100, [weapons.longsword()]);
        a.e(-100, -100, [weapons.broom()]);
        
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}