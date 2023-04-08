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
        a.e(-100, 600, [weapons.longsword()]);
        a.e(600, -100, [weapons.speedsword()]);

        a.e(600+100, 400+100, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI)]);

        break;
      case 2:
        // code block
        a.e(600+100, 400+100, [weapons.longsword()]);
        a.e(-100, -100, [weapons.broom()]);

        a.e(300, -100, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)]);
        a.e(400, -100, [weapons.short_dagger(1, 0), weapons.short_dagger(1, -Math.PI/2)]);
        a.e(500, -100, [weapons.short_dagger(1, 0), weapons.short_dagger(1, Math.PI/2)]);
        
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}