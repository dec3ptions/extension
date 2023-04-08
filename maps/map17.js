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
        for (let i=0;i<25;i++) {
            a.e(...this.r.xy(2), [weapons.longsword()], 0.8, 1.2);
            a.e(...this.r.xy(1), [weapons.speedsword()], 0.5, 0.9);
            
        }
        break;
      case 2:
        // code block
        for (let i=0;i<5;i++) {
            a.e(...this.r.xy(1.4), [weapons.mace()], 1.7, 0.9, null, 1200);
            a.e(...this.r.xy(2), [weapons.long_axe()], 1.7, 0.9, null, 1200);
        }
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}