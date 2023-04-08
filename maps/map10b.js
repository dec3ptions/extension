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
        
        a.e(500, 600, [weapons.tiny_fast_dagger()], 0.5, 3.5);
        a.e(400, 550, [weapons.tiny_fast_dagger()], 0.5, 3.5);
        a.e(500, 500, [weapons.tiny_fast_dagger()], 0.5, 3.5);
        a.e(400, 450, [weapons.tiny_fast_dagger()], 0.5, 3.5);

        a.e(300, 600, [weapons.tiny_fast_dagger()], 0.5, 3.5, 30);
        a.e(200, 550, [weapons.tiny_fast_dagger()], 0.5, 3.5, 30);
        a.e(300, 500, [weapons.tiny_fast_dagger()], 0.5, 3.5, 30);
        a.e(200, 450, [weapons.tiny_fast_dagger()], 0.5, 3.5, 30);

        a.e(-100, 600, [weapons.shield()], 1.3, 0.9, null, 1000);
        
        a.e(800, -100, [weapons.pendulum()], 1.3, 0.9, null, 1000);
        a.e(670, -300, [weapons.pendulum(), weapons.pendulum(1, Math.PI/2)], 1.3, 1.4, null, 1000);
        a.e(670, 100, [weapons.pendulum(), weapons.pendulum(1, -Math.PI/2)], 1.3, 1.4, null, 1000);
        a.e(670, -400, [weapons.pendulum(), weapons.pendulum(1, Math.PI/2)], 1.3, 1.4, null, 1000);


        break;
      case 2:
        // code block

        a.e(300, -100, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)], 1.8, 0.6, null, 1000);
        a.e(400, -100, [weapons.short_dagger(1, 0), weapons.short_dagger(1, -Math.PI/2)], 1.8, 0.6, null, 1000);
        a.e(500, -100, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)], 1.8, 0.6, null, 1000);
        
        a.e(-100, 600, [weapons.longsword()], 1.3, 0.9, null, 900);
        a.e(600, -100, [weapons.longsword()], 1.3, 0.9, null, 900);
        a.e(600+100, 400+100, [weapons.short_dagger()], 1.3, 0.9, null, 900);
        a.e(800, -100, [weapons.pendulum()], 1.3, 0.9, null, 1000);
        a.e(670, -300, [weapons.pendulum(), weapons.pendulum(1, Math.PI/2)], 1.3, 1.4, null, 1000);

        for (let i=0;i<6;i++) {
          a.e(i*600/4 - 100, 600 + (50 * (i%3)), [weapons.pendulum()], 0.5, 3.5, null, 800);
        }
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}