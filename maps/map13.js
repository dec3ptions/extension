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
        
        a.e(this.r.x(), this.r.y(), [weapons.wolverine(), weapons.shield()], 1.5, 1.1);
        a.e(this.r.x(), this.r.y(), [weapons.slow_pendulum(Math.PI/2), weapons.wolverine(0)], 1.5, 1.1);

        a.e(this.r.x(), this.r.y(), [weapons.staff(Math.PI/2), weapons.staff(0), weapons.staff(Math.PI/4)], 1.0, 2.4);
        a.e(this.r.x(), this.r.y(), [weapons.staff(Math.PI/2), weapons.staff(0), weapons.staff(Math.PI/4)], 1.0, 2.4);
        a.e(this.r.x(), this.r.y(), [weapons.staff(Math.PI/2), weapons.staff(0), weapons.staff(Math.PI/4)], 1.0, 2.4);

        break;
      case 2:
        // code block
        for (let i=0;i<10;i++) {
            a.e(this.r.x(), this.r.y(), [weapons.staff(Math.PI/2), weapons.superfast(), weapons.wearable()], 0.7, 2);
        }
        
        break;
      case 3:
        // code block
        for (let i=0;i<15;i++) {
            a.e(this.r.x(), this.r.y(), [weapons.wolverine()], 0.8, 1.2);
            a.e(this.r.x(), this.r.y(), [weapons.staff()], 0.8, 1.2);
        }
        
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}