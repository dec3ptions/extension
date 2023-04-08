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
        
        a.e(670, -300, [weapons.pendulum(1, 0), weapons.pendulum(1, Math.PI/2)]);

        if (true) {
          var b = weapons.butterfly();

          var interval = setInterval(function() {
            b.spin *= -1;
          }, 1000);

          a.e(500, 500, [b], 2, 0.4, interval);
        }

        if (true) {
          var b2 = weapons.butterfly();

          var interval2 = setInterval(function() {
            b2.spin *= -1;
          }, 900);

          a.e(-100, 200, [b2], 2, 0.4, interval2);
        }
        

        

        break;
      case 2:
        // code block

        
        var bs = [];
        for (let r=0;r<7;r++) {
          for (let i=0;i<4;i++) {
            var b = weapons.lol_fist(1, i*Math.PI/2, -40 - r*60, 2*r/8);
            bs.push(b);
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