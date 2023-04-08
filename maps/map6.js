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

        for (let i=0;i<6;i++) {
          a.e(i*600/6, -100 - (50 * (i%3)), [weapons.pendulum()]);
        }


        for (let i=0;i<6;i++) {
          a.e(i*600/6, 500 + (50 * (i%3)), [weapons.pendulum()]);
        }
        break;
      case 2:
        // code block
        
        var bs = [];
        for (let i=0;i<26;i++) {
          // var b = new Blade(0,0, 60, 30, 0, -40 - i*20, 2, i*Math.PI/4);
          var b = weapons.lol_fist(1, i*Math.PI/6, -20 - i*12); //i*Math.PI/18
          bs.push(b);
        }

        a.e(-100, -100, bs);


        break;
      default:
        // code block
        state.set("victory")
    }

  }
}