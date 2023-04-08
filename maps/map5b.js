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
        
        a.e(500, 600, [weapons.tiny_fast_dagger()], 0.5, 2.5, null, 10);
        a.e(400, 450, [weapons.tiny_fast_dagger()], 0.5, 2.5, null, 10);

        a.e(300, 600, [weapons.tiny_fast_dagger()], 0.5, 2.5, null, 10);
        a.e(200, 550, [weapons.tiny_fast_dagger()], 0.5, 2.5, null, 10);

        a.e(-200, 440, [weapons.superfast()], 0.5, 3, null, 30);
        a.e(600, -10, [weapons.superfast()], 0.5, 3, null, 30);
        a.e(-100, 420, [weapons.superfast()], 0.5, 3, null, 30);

        a.e(700, -10, [weapons.superfast()], 0.5, 3, null, 30);

        break;
      case 2:
        // code block

        a.e(-100, 500, [weapons.broom(), weapons.pendulum()], 3, 1, null, 1000);
        a.e(400, 500, [weapons.broom(), weapons.pendulum()], 3, 1, null, 1000);

        
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}