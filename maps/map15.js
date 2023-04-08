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
      case 1:
        // code block
        for (let i=0;i<6;i++) {
            a.e(200,300, [weapons.wolverine()], 1.8, 0.9, null, 300 * i);
        }
        // code block
        for (let i=0;i<7;i++) {
            a.e(...this.r.xy(1.5), [weapons.pixel1()], 0.7, 1.5);
        }
        
        break;
      case 2:
        // code block
        for (let i=0;i<7;i++) {
            a.e(...this.r.xy(), [weapons.wolverine()], 1.8, 0.9, null, 1100);
            a.e(...this.r.xy(1.5), [weapons.superfast(), weapons.wearable()], 0.7, 2);
        }
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}