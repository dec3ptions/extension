var map = {
  wave: 0,
  r: {
    x: function() {
      if (Math.random() < 0.5) {
        return -100 - 200 * Math.random();
      } else {
        return 550 + 100 - 200 * Math.random();
      }
    },
    y: function() {
      if (Math.random() < 0.5) {
        return -100 - 200 * Math.random();
      } else {
        return 430 + 100 - 200 * Math.random();
      }
    },
    xy: function(r=1) {
      let angle = 2 * Math.PI * Math.random();
      let x = r * 350 * Math.cos(angle) + 550/2;
      let y = r * 350 * Math.sin(angle) + 430/2;
      return [x, y];
    }
  },
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
      case 2:
        // code block
        for (let i=0;i<15;i++) {
            // a.e(...this.r.xy(2), [weapons.short_dagger()], 0.8, 1.2);
            a.e(...this.r.xy(1), [weapons.banana()], 0.5, 0.9);
            a.e(...this.r.xy(1.5), [weapons.slow_pendulum()], 0.5, 0.9);
        }
        break;
      case 1:
        // code block
        for (let i=0;i<20;i++) {
            a.e(...this.r.xy(0.8), [weapons.wearable()], 0.5, 0.25, null, 600);
            a.e(...this.r.xy(0.8), [weapons.wearable()], 0.5, 0.25, null, 600);
            a.e(...this.r.xy(0.8), [weapons.tiny_fast_dagger()], 0.5, 0.25, null, 600);
        }
        // for (let i=0;i<5;i++) {
        //     a.e(...this.r.xy(1.4), [weapons.broom()], 2, 0.7, null, 1200);
        //     a.e(...this.r.xy(1.4), [weapons.lol_fist()], 1.7, 0.9, null, 1200);
        // }

        break;
      default:
        // code block
        state.set("victory")
    }

  }
}