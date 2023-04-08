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
        
        a.e(500, 600, [weapons.tiny_fast_dagger()], 0.5, 3.5);
        a.e(400, 550, [weapons.tiny_fast_dagger()], 0.5, 3.5);
        a.e(500, 500, [weapons.tiny_fast_dagger()], 0.5, 3.5);
        a.e(400, 450, [weapons.tiny_fast_dagger()], 0.5, 3.5);

        a.e(300, 600, [weapons.tiny_fast_dagger()], 0.5, 3.5, 30);
        a.e(200, 550, [weapons.tiny_fast_dagger()], 0.5, 3.5, 30);
        a.e(300, 500, [weapons.tiny_fast_dagger()], 0.5, 3.5, 30);
        a.e(200, 450, [weapons.tiny_fast_dagger()], 0.5, 3.5, 30);

        a.e(-100, 420, [weapons.superfast()], 0.5, 4);
        a.e(400, -10, [weapons.superfast()], 0.5, 4);

        a.e(-240, 440, [weapons.superfast()], 0.5, 4);
        a.e(700, -10, [weapons.superfast()], 0.5, 4);

        a.e(400, 500, [weapons.pendulum()], 1, 1);

        break;
      case 3:
        // code block

        a.e(-100, 500, [weapons.shield(), weapons.broom(), weapons.pendulum()], 3, 1, null, 1200);
        a.e(400, 500, [weapons.shield(), weapons.broom(), weapons.pendulum()], 3, 1, null, 1200);

        
        break;
      case 1:
        // code block

        a.e(-100, 420, [weapons.superfast()], 0.5, 4, null, 230);
        a.e(400, -10, [weapons.superfast()], 0.5, 4, null, 30)

        a.e(-200, 440, [weapons.superfast()], 0.5, 4, null, 230);
        a.e(600, -10, [weapons.superfast()], 0.5, 4, null, 30)

        a.e(-240, 440, [weapons.superfast()], 0.5, 4, null, 230);
        a.e(700, -10, [weapons.superfast()], 0.5, 4, null, 30);

        
        break;
      default:
        // code block
        state.set("victory")
    }

  }
}