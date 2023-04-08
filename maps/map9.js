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

        function spawn_special(x,y) {

          var bs = [];
          for (let i=0;i<4;i++) {
            // var b = new Blade(0,0, 60, 80, 0, -40, 1, i*Math.PI/4);
            var b = weapons.lol_fist(1, i*Math.PI/4, -40); //2*r/8

            bs.push(b);
          }

          a.e(x, y, bs);
        }

        spawn_special(-100, 500);
        spawn_special(610, 500);

        spawn_special(-100, -50);
        spawn_special(610, -50);
        spawn_special(300, -50);

        
        
        break;
      case 2:

        
        a.e(-100, 600, [weapons.longsword()]);
        a.e(300, -200, [weapons.longsword()]);
        a.e(500, -200, [weapons.longsword()]);
        a.e(600+100, 400+100, [weapons.short_dagger()]);
        a.e(600+40, 400+150, [weapons.short_dagger()]);

        a.e(-240, 440, [weapons.superfast()], 0.5, 4);
        a.e(-140, 440, [weapons.superfast()], 0.5, 4);



        break;
      default:
        // code block
        state.set("victory")
    }

  }
}