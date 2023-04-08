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
      case 2:


        // code block

        function spawn_special(x,y) {

          var bs = [];
          for (let i=0;i<5;i++) {
            // var b = new Blade(0,0, 60, 30, 0, -40, 1, i*Math.PI/4);

            if (i != 2) {
              var b = weapons.lol_fist(1, i*Math.PI/3, -40, 1);
              bs.push(b);
            }
            
          }

          a.e(x, y, bs, 1, 0.6, null, 700);
        }

        spawn_special(-100, 500);
        spawn_special(610, 500);

        spawn_special(-100, -50);
        spawn_special(610, -50);
        spawn_special(300, -50);

        
        
        break;
      case 1:

        
        // code block
        a.e(-100, 450, [weapons.shield(1, 0), weapons.longsword(1, Math.PI/2)], 1, 1, null, 900);
        
        a.e(670, -100, [weapons.shield(1, 0), weapons.shield(1, Math.PI/2)], 1, 1, null, 900);

        a.e(600+100, 400+100, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI)], 1, 1, null, 900);

        a.e(-100, 600, [weapons.longsword()]);
        a.e(300, -200, [weapons.longsword()]);
        a.e(600+40, 400+150, [weapons.short_dagger()]);

        a.e(-240, 440, [weapons.superfast()], 0.5, 4);
        a.e(-140, 440, [weapons.superfast()], 0.5, 4);

        for (let i=0;i<6;i++) {
          a.e(i*600/6, 500 + (50 * (i%3)), [weapons.pendulum()], 1, 1, null, 600);
        }

        break;
      default:
        // code block
        state.set("victory")
    }

  }
}