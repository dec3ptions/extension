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
        
        a.e(-100, 500, [weapons.slow_pendulum(), weapons.shield()], 1.5, 1.1);
        a.e(200, 500, [weapons.slow_pendulum(), weapons.shield()], 1.5, 1.1);
        a.e(500, 500, [weapons.slow_pendulum(), weapons.shield()], 1.5, 1.1);
        a.e(700, 500, [weapons.slow_pendulum(), weapons.shield()], 1.5, 1.1);
        a.e(-100, -100, [weapons.slow_pendulum(), weapons.shield()], 1.5, 1.1);
        a.e(200, -100, [weapons.slow_pendulum(), weapons.shield()], 1.5, 1.1);
        a.e(500, -100, [weapons.slow_pendulum(), weapons.shield()], 1.5, 1.1);
        a.e(700, -100, [weapons.slow_pendulum(), weapons.shield()], 1.5, 1.1);
        a.e(-100, 100, [weapons.slow_pendulum(), weapons.shield()], 1.5, 1.1);
        a.e(700, 100, [weapons.slow_pendulum(), weapons.shield()], 1.5, 1.1);

        break;
      case 2:
        // code block
        
        var bs = [];
        for (let x=-5;x<10;x++) {
          for (let y=0;y<5;y++) {
            a.e(x*60, 430 + y * 170 + 90*(x%3), [(Math.random() > 0.5) ? weapons.superfast() : weapons.wearable()], 0.5, 2.4);
            a.e(x*60, 430 + y * 170 + 90*(x%3), [], 4, 2.4);
          }
        }

        a.e(-100, -100, bs);


        
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}