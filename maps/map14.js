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
        for (let i=0;i<8;i++) {
            a.e(this.r.x(), this.r.y(), [weapons.wolverine()], 1.8, 0.9, null, 1100);
            a.e(this.r.x(), this.r.y(), [weapons.katana()], 1.8, 0.9, null, 1100);
        }
        
        break;
      case 2:
        a.e(this.r.x(), this.r.y(), [weapons.cool1()], 0.5, 1.2, null, 2700);
        a.e(this.r.x(), this.r.y(), [weapons.cool1()], 0.5, 1.2, null, 2700);
        
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}