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
        a.e(600, -100, [weapons.longsword()]);
        a.e(600+100, 400+100, [weapons.short_dagger()]);

        break;
      case 2:
        // code block
        a.e(600+100, 400+100, [weapons.longsword()]);
        a.e(-100, -100, [weapons.broom(-1)]);
        a.e(300, -100, [weapons.short_dagger()]);
        
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}