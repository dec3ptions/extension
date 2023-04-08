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
        a.e(-100, 600, [weapons.shield()]);
        
        a.e(800, -100, [weapons.pendulum()]);
        a.e(670, -300, [weapons.pendulum(), weapons.pendulum(1, Math.PI/2)]);
        a.e(670, 100, [weapons.pendulum(), weapons.pendulum(1, -Math.PI/2)]);
        a.e(670, -400, [weapons.pendulum(), weapons.pendulum(1, Math.PI/2)]);

        a.e(600+100, 400+100, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI)]);

        break;
      case 2:
        // code block
        a.e(600+200, 400+200, [weapons.longsword()]);
        a.e(-100, 400+200, [weapons.longsword()]);
        a.e(-100, -200, [weapons.broom()]);

        a.e(300, -200, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)]);
        a.e(400, -200, [weapons.short_dagger(1, 0), weapons.short_dagger(1, -Math.PI/2)]);
        a.e(500, -200, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)]);


        a.e(300, 500, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)]);
        a.e(400, 600, [weapons.short_dagger(1, 0), weapons.short_dagger(1, -Math.PI/2)]);
        a.e(500, 500, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)]);

        a.e(500, 500, [weapons.pendulum(1, 0), weapons.pendulum(1, Math.PI/2)]);
        a.e(350, -150, [weapons.pendulum(1, 0), weapons.pendulum(1, -Math.PI/2)]);
        a.e(200, 500, [weapons.pendulum(1, 0), weapons.pendulum(1, Math.PI/2)]);
        
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}