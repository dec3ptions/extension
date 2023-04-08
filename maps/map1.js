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
        a.e(700, 200, [weapons.starter_sword()]);

        break;
      case 2:
        // code block
        a.e(-100, -100, [weapons.starter_sword()]);
        a.e(600, -100, [weapons.starter_sword()]);
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}