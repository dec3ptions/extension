

const ACTION_SPIN_MULTIPLIER = 7;

const action_names = {
	none: "",
	spin: "Enchantment: Tornado Spin<br><i>Click to rapidly spin the dagger</i>",
	throw: "Enchantment: Dagger Throw<br><i>Click to throw the dagger</i>",
	scare: "Enchantment: Onion Smell<br><i>Click to scare the enemies away</i>",
}

var action_manager = {
	global_effects: {},
	daggers: [],
	counter: 0,
	equip_dagger: function(dagger_id) {

		let dagger = weapon_blueprint[dagger_id];
		// console.log("dagger.action", dagger.action);
		if (dagger.action != null) {
			dagger.index = this.counter;
			this.daggers.push(dagger);
			let blade = me.blades[this.counter];
			blade.set_ready();
		}
		this.counter += 1;
	},
	reset: function() {
		this.counter = 0;
		this.global_effects = {};
		this.daggers = [];
	},
	click: function() {
		if (this.daggers.length == 0) {
			return;
		}
		this.activate_dagger(this.daggers[0]);
		this.daggers = this.daggers.slice(1);
	},
	activate_dagger: function(dagger) {
		let blade = me.blades[dagger.index];
		const game_num_2 = game_num;

		if (dagger.action == "spin") {
			blade.spin *= ACTION_SPIN_MULTIPLIER;
			
			setTimeout(function() {
				if (game_num_2 != game_num) {
					return;
				}
				blade.spin /= ACTION_SPIN_MULTIPLIER;
				blade.set_not_ready();
			}, 2000);
		}
		if (dagger.action == "scare") {
			this.global_effects.scare = true;
			setTimeout(function() {
				if (game_num_2 != game_num) {
					return;
				}
				action_manager.global_effects.scare = false;
				blade.set_not_ready();
			}, 2000);
		}
		if (dagger.action == "throw") {
			bullet_manager.shoot(dagger);
			blade.set_not_ready();
		}
	},
	reset_dagger: function(dagger) {
		
	}
	
}







var a = {
	e: function(px, py, blades, enemy_radius, enemy_speed, interval, hp) {

		var enemy = new Enemy(px, py, blades, enemy_radius, enemy_speed, interval, hp);
		enemies.push(enemy);
	},
	wave_msg: function(tide_num) {
		$("#overlay_msg").css("visibility", "visible");
		$("#overlay_txt").text(`Wave ${wave_num} - ${tide_num}`);
		$("#overlay_msg").hide();
		$("#overlay_msg").fadeIn();

		setTimeout(function() {
			$("#overlay_msg").fadeOut();
		}, 3000);
	}
}




var assets = {};

var asset_design = {
  room1: "backgrounds/room1.png",
  me: "characters/player.png",
  p_0: "characters/player_animation/0.png",
  p_1: "characters/player_animation/1.png",
  p_2: "characters/player_animation/2.png",
  p_3: "characters/player_animation/3.png",

  e_0: "characters/enemy_animation/0.png",
  e_1: "characters/enemy_animation/1.png",
  e_2: "characters/enemy_animation/2.png",
  e_3: "characters/enemy_animation/3.png"
}

var asset_manager = {
  init: function() {
    

    for (let weapon_id in weapon_blueprint) {
      asset_design["w_"+weapon_id] = `weapons/${weapon_id}.png`;

      if (weapon_blueprint[weapon_id].action != null) {
        asset_design["w_"+weapon_id+"_ready"] = `weapons/${weapon_id}_ready.png`;
      }
    }

    return new Promise(resolve => {
      this.load_assets_sync(asset_design, response => resolve(response));
    });
  },
  load_assets_sync: function(to_load, callback) {
    function to_url(v) {
      return "assets/"+to_load[v];
    }

    for (let k in to_load) {
      if (PIXI.Loader.shared.resources[to_url(k)] != null) {
        delete to_load[k];
      }
    }

    let asset_names = Object.keys(to_load);
    let asset_urls = asset_names.map(v => to_url(v));
    let num_assets = asset_names.length;

    PIXI.Loader.shared.add(asset_urls).load(function() {
      for (var i=0;i<num_assets;i++) {
        let asset_name = asset_names[i];
        let asset_url = asset_urls[i];
        assets[asset_name] = PIXI.Loader.shared.resources[asset_url].texture;
      }
      callback();
    });
  },
  load_more: function(asset_paths) {
    return new Promise(resolve => {
      this.load_assets_sync(asset_paths, response => resolve(response));
    });
  }
}




var audio_blueprint = {
	die: "assets/sounds/die.wav",
	levelup: "assets/sounds/levelup.wav",
	F: "assets/sounds/F.wav",
	D: "assets/sounds/D.wav",
	stairways: "assets/songs/stairways.mp3"
}


var volumes = {
	stairways: 0.4
}

var audio = {
	song: null,
	last_song: null,
	load_sound: function(audio_id, audio_url) {
		var options = {
			path: audio_url,
			volume: volumes[audio_id] || 1
		}

		return new Pizzicato.Sound({ 
		    source: 'file',
		    options: options
		}, function() {
			console.log("Loaded!")
		});
	},
	init: async function() {

		for (let audio_id in audio_blueprint) {
			let audio_url = audio_blueprint[audio_id];
			
			this[audio_id] = this.load_sound(audio_id, audio_url); //PIXI.sound.Sound.from(audio_url);
		}
	},
	play: function(name) {
		if (settings.sound_effects == "On") {
			this[name].play();
		}
	},
	play_song: function(name) {
		this.song = name;
		this.last_song = name;
		if (settings.background_music == "On") {
			this[name].play();
		}
	},
	stop_song: function() {
		if (this.song == null) {
			return;
		}
		this[this.song].stop();
		this.song = null;
	}
}



var num_blades = 0;

class Blade {
	constructor(asset, polygon_nodes, offsetX, offsetY, spin, init_r=0, dmg) {
		this.asset = asset;
		this.spin = spin;
		this.dmg = dmg;
		this.dead = false;
		this.id = num_blades;
		num_blades += 1;
		
		let px = 0;
		let py = 0;
		
		let texture = assets[asset];
		if (texture == null) {
			console.error("Asset not found", asset);
		}
		this.ren2 = new PIXI.Sprite(texture);
		this.ren2.position.x = px;
		this.ren2.position.y = py;
		this.ren2.rotation = init_r;
		this.ren2.alpha = (!testing) ? 1 : 0.7;



		if (this.spin < 0) {
			this.ren2.scale.set(-1, 1);
		}

		var points = [];
		var vectors = [];
		// console.log("polygon_nodes", polygon_nodes);
		
		for (let polygon_node of polygon_nodes) {
			var x = polygon_node[0];
			var y = polygon_node[1];
			if (this.spin < 0) {
				// console.log(this.ren2.width);
				x = this.ren2.width - x + offsetX *2;
				console.log(x);
			}
			points.push(new PIXI.Point(x, y));
			vectors.push(new SAT.Vector(x, y));
		}
		if (this.spin < 0) {
			points.reverse();
			vectors.reverse();
		}
		
		this.ren = new PIXI.Graphics();
	    this.ren.beginFill(0x00ff00);
	    this.ren.drawPolygon(...points);
	    this.ren.endFill();
	    this.ren.position.x = px;
		this.ren.position.y = py;
	    this.ren.rotation = init_r;
	    this.ren.alpha = (!testing) ? 0 : 0.4;


		this.col = new SAT.Polygon(new SAT.Vector(px,py), vectors);


		var offset_x = this.ren2.width/2 + offsetX;
		var offset_y = 0 + offsetY;

	    this.ren.pivot.set(offset_x, offset_y);
	    this.ren2.pivot.set(offset_x, offset_y);
		this.col.setOffset(new SAT.Vector(-offset_x, -offset_y));
	}
	rotate(amount) {
		if (this.dead == true) {
			return;
		}
		this.ren.rotation += amount;
		this.ren2.rotation = this.ren.rotation;
		this.col.setAngle(this.ren.rotation);
	}
	kill() {
		this.dead = true;
	}
	translate(x, y) {
		if (this.dead == true) {
			return;
		}
		this.col.pos.x = x;
		this.col.pos.y = y;
	}
	update(delta) {
		if (this.dead == true) {
			return;
		}
		this.blade.ren.rotation += delta * 0.01;
		this.blade.ren2.rotation = this.blade.ren.rotation;
		this.blade.col.setAngle(this.blade.ren.rotation);
	}

	delete() {
		// this.blade.ren.destroy();
		// this.blade.ren2.destroy();
	}

	set_ready() {
		this.ren2.texture = assets[this.asset+"_ready"];
	}

	set_not_ready() {
		this.ren2.texture = assets[this.asset];
	}
	
}



var testing = true;

$( document ).ready( async function() {
  await state.init();
  await deployment.init();
  await join_params.init();



  if (window.fire == null) {
    window.fire = async (a,b) => {};
  }
  
  
  await sync.init();

  await webext.init();
  await settings.init();
  await size.popup();
  await asset_manager.init();
  await weapon_manager.init();
  await scorekeeper.init();
  await upgrades.init();
  await energy.init();
  await daily_gift.init();
  await dagger_selection.init();
  await news.init();
  
  await start.init();
  await controls.init();
  await story.init();
  await update.init();
  await popup.init();
  await audio.init();

  await join_params.open_destination();


  

  console.log("boot done..");



});



const BULLET_SPEED = 5;

var bullet_manager = {
	bullets: [],
	shoot: function(dagger) {
		let bullet = new Bullet(dagger);
		this.bullets.push(bullet);
	}
}

class Bullet {
	constructor(dagger) {
		let mouse = app.renderer.plugins.interaction.mouse.global;
		let fire_direction = {
			x: mouse.x - app.screen.width/2, //me.cont.position.x,
			y: mouse.y - app.screen.height/2, //me.cont.position.y,
		}
		console.log("mouse", fire_direction);
		
		//new Bullet(p.x, p.y, v.x, v.y, dagger.id, dagger.dmg, 0);
		// px, py, vx, vy, asset, dmg, spin

		let p = me.cont.position;
		let v = fire_direction;
		let init_r = Math.atan2(v.y,v.x);
		let spin = 1;
		let dmg = dagger.dmg;
		
		this.lifespan = 100;
		this.alive = true;

		this.px = p.x;
		this.py = p.y;
		this.vx = Math.cos(init_r) * BULLET_SPEED; //v.x;
		this.vy = Math.sin(init_r) * BULLET_SPEED; //v.y;

		this.cont = new PIXI.Container();
		this.cont.position.x = this.px;
		this.cont.position.y = this.py;

		app.stage.addChild(this.cont);
		this.blade = new Blade(`w_${dagger.id}_ready`, dagger.nodes, dagger.offsetX, dagger.offsetY, spin, init_r, dmg);
		this.blade.rotate(-Math.PI/2);

		this.cont.addChild(this.blade.ren2);
		this.cont.addChild(this.blade.ren);
	}

	update(delta) {
		if (!this.alive) {
			return;
		}
		if (this.lifespan < 0) {
			this.delete();
			return;
		}

		this.lifespan -= delta;
		
		this.px += this.vx * delta;
		this.py += this.vy * delta;

		this.move_to({x: this.px, y: this.py});

		var response = new SAT.Response();

		for (var i=enemies.length-1;i>=0;i--) {
			let enemy = enemies[i];
			var polygon = this.blade.col;
			var circle = enemy.circle.col;

			var collided = SAT.testPolygonCircle(polygon, circle, response);

			if (collided == true) {
				enemy.hurt(this.blade.id, this.blade.dmg);
				if (enemy.hp <= 0) {
					enemy.delete();
					enemies.splice(i, 1);
					map.spawn_wave();
				}
			}

			response.clear();
		}

	}

	move_to(pos) {
		this.cont.position.x = pos.x;
		this.cont.position.y = pos.y;
		this.blade.translate(pos.x, pos.y);
	}

	delete() {
		if (!this.alive) {
			return;
		}
		this.alive = false;
		this.blade.kill();
		this.blade.ren.destroy();
		this.blade.ren2.destroy();
	}
}





class Circle {
	constructor(px, py, radius) {
		this.ren = new PIXI.Graphics();
		this.ren.beginFill(0x000000);
		this.ren.drawCircle(px, py, radius);
		this.ren.endFill();
		this.ren.position.x = px;
		this.ren.position.y = py;
		this.ren.alpha = 0.0;

		this.col = new SAT.Circle(new SAT.Vector(px,py), radius);
		// this.col = this.col.toPolygon();
	}
	translate(x, y) {
		// this.col.translate(x, y);
		this.col.pos.x = x;
		this.col.pos.y = y;
		// this.ren.position.x += x * delta;
		// this.ren.position.y += y * delta;
	}
	delete() {
	}
	
}






const config = {
	chrx_id: "jjjoiagdgjhecijlkfkipeilgfgbhkgc",
	dev_chrx_id: "eldladmcgmdpjbbichheobiogbblgpbe",
	sync_id: "1@",

	dec3ptions: "999999999",
}



var controls = {
  left: false,
  right: false,
  up: false,
  down: false,
  mouse_x: 0,
  mouse_y: 0,
  init: function() {
    this.bind_keys();
    this.bind_mouse();
  },
  bind_mouse: function() {
    $(document).mousedown(controls.mousedown);
    $(document).mouseup(controls.mouseup);

    $(document).mousemove(function(event) {
      controls.mouse_x = event.pageX;
      controls.mouse_y = event.pageY;

      // NOTE: Use this instead:
      // >> app.renderer.plugins.interaction.mouse.global;
    });
  },
  mousedown: function(event) {
    if (state.playing) {
      action_manager.click();
    }

  },
  mouseup: function() {



  },
  bind_keys: function() {
    document.onkeydown = function(e) {
      // left
      if ((e.keyCode == 37) || (e.keyCode == 65)) {
        controls.left = true; controls.right = false;
        motion.anim_start();
      }
      // right
      if ((e.keyCode == 39) || (e.keyCode == 68)) {
        controls.right = true; controls.left = false;
        motion.anim_start();
      }
      // up
      if ((e.keyCode == 38) || (e.keyCode == 87)) {
        controls.up = true; controls.down = false;
        motion.anim_start();
      }
      // down
      if ((e.keyCode == 40) || (e.keyCode == 83)) {
        controls.down = true; controls.up = false;
        motion.anim_start();
      }
      // spacebar
      if (e.keyCode == 32) {
      }
      // escape
      if (e.keyCode == 27) {
        if (state.table_chatting) {
          state.set("moving");
          state.ignore("table_chatting");
        }
      }
      // enter
      if (e.keyCode == 13) {
        if (state.moving) {
          state.set("hover_chatting");
        } else if (state.hover_chatting) {
          widgets.hover_chatting.send();
          state.set("moving");
        } else if (state.table_chatting) {
          widgets.table_chatting.send();
        }
      }

      // const num_keys = [49, 50, 51, 52, 53, 54, 55];
      // for (var i=0;i<num_keys.length;i++) {
      //   if (e.keyCode == num_keys[i]) {
      //     hand.key(i);
      //   }
      // }
      
    }
    document.onkeyup = function(e) {
      // left
      if ((e.keyCode == 37) || (e.keyCode == 65)) {
        controls.left = false;
        motion.anim_stop();
      }
      // right
      if ((e.keyCode == 39) || (e.keyCode == 68)) {
        controls.right = false;
        motion.anim_stop();
      }
      // up
      if ((e.keyCode == 38) || (e.keyCode == 87)) {
        controls.up = false;
        motion.anim_stop();
      }
      // down
      if ((e.keyCode == 40) || (e.keyCode == 83)) {
        controls.down = false;
        motion.anim_stop();
      }
    }
  }
}




var dagger_selection = {
	equipped: [],
	unlocked: [],
	unequipped: [],
	dagsel_closeup_action_fn: () => {},
	init: async function() {
		console.log("INIT");
		this.equipped = [];
		this.unlocked = [];
		this.unequipped = [];

		this.equipped = await sync.async_get("dagsel_equipped");
		if (this.equipped != null) {
			this.equipped = JSON.parse(this.equipped);
		}
		
		if (this.equipped == null) {
			this.equipped = ["starter_sword"];
			await sync.async_set("dagsel_equipped", JSON.stringify(this.equipped));
			await sync.async_set("w_starter_sword", 1);
		}
		
		for (let weapon_id in weapon_blueprint) {
			let weapon = weapon_blueprint[weapon_id];
			var n = await sync.async_get("w_"+weapon_id) || 0;
			if (n > 0) {
				this.unlocked.push({
					id: weapon_id,
					n: n
				});
			} else if ((testing) && (weapon.player == true)) {
				this.unlocked.push({
					id: weapon_id,
					n: 1
				});
			}
		}

		
		for (let unlocked of this.unlocked) {
			let weapon_id = unlocked.id;

			var num_equipped = 0;
			for (let equipped of this.equipped) {
				if (equipped == weapon_id) {
					num_equipped += 1;
				}
			}
			var weapon_num = unlocked.n - num_equipped;
			if (weapon_num > 0) {
				this.unequipped.push({
					id: weapon_id,
					n: weapon_num
				});
			}	
		}


		console.log("this.unlocked", this.unlocked);
		console.log("this.equipped", this.equipped);
		console.log("this.unequipped", this.unequipped);


		$("#dagsel_equipped").html("");
		$("#dagsel_unequipped").html("");
		var i=0;
		for (let weapon_id of this.equipped) {
			i += 1;
			this.init_dagger(weapon_id, true, 1, i);
		}

		for (let obj of this.unequipped) {
			i += 1;
			this.init_dagger(obj.id, false, obj.n, i);
		}
	},
	init_dagger: function(weapon_id, is_equipped, weapon_num, index) {
		// alert()
		let weapon = weapon_blueprint[weapon_id];
		let img_src = (weapon.action == null) ? `${weapon_id}.png` : `${weapon_id}_ready.png`;

		var html = `<div class="dagsel_cell"><div>${weapon_num}</div><img id="d_${weapon_id}_${index}" src="assets/weapons/${img_src}"></div>`
		if (is_equipped) {
			$("#dagsel_equipped").append(html);
		} else {
			$("#dagsel_unequipped").append(html);
		}

		$(`#d_${weapon_id}_${index}`).click(function() {
			// let parent_id = $(this).parent().attr('id');
			// let is_equipped = (parent_id == "dagsel_equipped");

			let params = {
				...weapon_blueprint[weapon_id],
				is_equipped: is_equipped,
				weapon_id: weapon_id
			}
			state.set("dagsel_closeup", params);
		});
	},
	equip_dagger: async function(weapon_id) {
		if (this.equipped.length < 4) {
			this.equipped.push(weapon_id);
			await sync.async_set("dagsel_equipped", JSON.stringify(this.equipped));
			await this.init();
			state.set("dagsel");
		} else {
			state.set("error", {
				h1: "You are using too many daggers at once.", 
				p: "Please un-equip a dagger first before equipping a new one.",
				target: "dagsel"
			});
		}
	},
	unequip_dagger: async function(weapon_id) {
		var i = this.equipped.indexOf(weapon_id);
		if (i == -1) return;
		this.equipped.splice(i, 1);
		await sync.async_set("dagsel_equipped", JSON.stringify(this.equipped));
		await this.init();
		state.set("dagsel");
	},
	unlock_dagger: async function(val_rule, from_daily_gift) {
		// select
		var weapon_ids = [];
		for (let weapon_id in weapon_blueprint) {
			let weapon = weapon_blueprint[weapon_id];
			if (val_rule(weapon) == true) {
				weapon_ids.push(weapon_id);
			}
			
		}
		let w_index = Math.floor(Math.random() * weapon_ids.length);
		var weapon_id = weapon_ids[w_index]; // CHANGE THIS LATER

		var n = await sync.async_get("w_"+weapon_id) || 0;

		var index = -1;
		var count = 0;
		for (let unlocked_dagger of this.unlocked) {
			if (unlocked_dagger.id == weapon_id) {
				index = count;
				break;
			}
			count += 1;
		}

		// apply
		await sync.async_set("w_"+weapon_id, n+1);

		if (index == -1) {
			this.unlocked.push({
				id: weapon_id,
				n: n + 1
			});
		} else {
			this.unlocked[index].n = n + 1;
		}

		if (from_daily_gift == false) {
			$("#dagsel_reward").html(`Dagger unlocked: ${weapon_blueprint[weapon_id].name}`);
			$("#dagsel_reward_img").attr('src', `assets/weapons/${weapon_id}.png`);
		} else {
			$("#dg_dagsel_reward").html(`Dagger unlocked: ${weapon_blueprint[weapon_id].name}`);
			$("#dg_dagsel_reward_img").attr('src', `assets/weapons/${weapon_id}.png`);
		}
		
		this.init();
	},
	reward_level_clear: function(i, n, from_daily_gift=false) {
		if (!from_daily_gift) {
			if (n > 0) {
				return;
			}
			if (i%2 == 0) {
				return
			}
		}
		

		if (i < 4) {
			this.unlock_dagger((dagger) => {
				return (dagger.tier < 2);
			}, from_daily_gift);
		} else if (i < 6) {
			this.unlock_dagger((dagger) => {
				return (dagger.tier < 3);
			}, from_daily_gift);
		} else if (i < 20) {
			this.unlock_dagger((dagger) => {
				return (dagger.tier < 4);
			}, from_daily_gift);
		} else {
			this.unlock_dagger((dagger) => {
				return (dagger.tier < 5);
			}, from_daily_gift);
		}

		
	}
}






const WAIT_TIME = 16 * 60 * 60; // seconds = 16 hours.

var daily_gift = {
	time_remaining: null,
	init: async function() {
		let last_opened = await sync.async_get("daily_gift") || 0;
		console.log("last_opened", last_opened);
		let time_elapsed = Math.floor((Date.now() - last_opened) / 1000);
		
		this.time_remaining = WAIT_TIME - time_elapsed;
		console.log("this.time_remaining", this.time_remaining);

		if (this.time_remaining <= 0) {
			this.time_remaining = 0;
		}
		
	},
	open: async function() {
		audio.play("levelup");

		var xp_amount = 300;

		$("#dg_xp_reward").html(`Gained ${xp_amount} XP!`);

		await sync.async_set("xp", Number(upgrades.xp) + xp_amount);
		this.init();

		let i = scorekeeper.next_map_index;
		dagger_selection.reward_level_clear(i, 0, true);

		await sync.async_set("daily_gift", Date.now());

		this.time_remaining = WAIT_TIME;
		
	},
	clock: function() {
		if (this.time_remaining > 0) {
			this.time_remaining -= 1;
			var s = this.to_analog(this.time_remaining);
			$("#daily_gift").html("Daily Gift:<br>"+s);
		} else {
			$("#daily_gift").html("Daily Gift:<br>Click to Open");
		}
	},
	to_analog: function(num) {
		var hours = Math.floor(num / 60 / 60);
		num -= 60 * 60 * hours;
		var minutes = Math.floor(num / 60);
		num -= minutes * 60;
		var seconds = num

		function str_pad_left(string,pad,length) {
		    return (new Array(length+1).join(pad)+string).slice(-length);
		}
		var finalTime = str_pad_left(hours,'0',2)+':'+str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
		return finalTime;
	}
}



var deployment = {
    is_chrome_ext: null,
    is_oworld: null,
    is_localhost: null,
    is_dev: null,
    init: function() {
        this.is_chrome_ext = this.check_is_chrome_ext();
        this.is_oworld = this.check_is_oworld();
        this.is_localhost = window.location.hostname == "localhost";
        this.is_dev = this.check_is_dev();
    },
    check_is_chrome_ext: function() {
        // firefox / I.E. / etc...
        if (window.chrome == null) {
            return false;
        }
        if (window.chrome.extension == null) {
            return false;
        }
        return true;
    },
    check_is_oworld: function() {
        if (window.is_oworld == true) {
            return true;
        }
        return false;
    },
    check_is_dev: function() {
        if (this.is_chrome_ext == false) {
            return false;
        }
        if (chrome.runtime.id == config.chrx_id) {
            return false;
        }
        return true;
    }
}



class Enemy {
	constructor(px, py, blades, enemy_radius=1, enemy_speed=1, interval, hp=100) {

		this.enemy_radius = enemy_radius;
		this.enemy_speed = enemy_speed;
		this.interval = interval;
		this.hp_max = hp;
		this.hp = hp;
		this.last_hurts = {};//[null, null, null, null];

		this.dead = false;
		this.age = 0;

		this.cont = new PIXI.Container();
		app.stage.addChild(this.cont);


		this.circle = new Circle(0,0, 20*enemy_radius);
		this.cont.addChild(this.circle.ren);

		this.blades = blades;
		var rand_amount = Math.random() * 2 * Math.PI;
		for (let blade of this.blades) {
			blade.ren.rotation += rand_amount;
			this.cont.addChild(blade.ren);
			this.cont.addChild(blade.ren2);
		}

		let textures = [];
		for (let i=0;i<4;i++) {
			let texture = assets['e_'+i];
			textures.push(texture);
		}
		this.body = new PIXI.AnimatedSprite(textures);
		this.body.loop = true;
		this.body.animationSpeed = 0.2;
		this.body.pivot.set(this.body.width / 2, this.body.height/2);
		this.body.play();
		this.cont.addChild(this.body);

		this.body.scale.set(enemy_radius, enemy_radius);

		this.hpsprite = new PIXI.Graphics();
		this.hpsprite.beginFill(hp_color(this.hp));
		this.hpsprite.drawRect(0, 0, 40, 7);
		this.hpsprite.endFill();
		this.hpsprite.pivot.set(this.hpsprite.width/2, -2.5 * this.hpsprite.height);
		this.hpsprite.scale.set(enemy_radius, enemy_radius);
		this.cont.addChild(this.hpsprite);

		this.move_to({x: px, y: py});
	}
	update(delta) {
		if (this.dead) {
			return;
		}
		this.age += delta;

		var vx = (this.cont.position.x > me.cont.position.x) ? -1 : 1;
		var vy = (this.cont.position.y > me.cont.position.y) ? -1 : 1;
		vx *= delta * 0.4 * this.enemy_speed;
		vy *= delta * 0.4 * this.enemy_speed;
		// scare
		vx *= (action_manager.global_effects.scare) ? -0.3 : 1;
		vy *= (action_manager.global_effects.scare) ? -0.3 : 1;

		let new_x = this.cont.position.x + vx;
		let new_y = this.cont.position.y + vy;

		this.move_to({x: new_x, y: new_y});



		for (let blade of this.blades) {
			blade.rotate(blade.spin * delta * 0.01);
		}

		if (this.age < 120) {
			return;
		}


		var response = new SAT.Response();
		for (let blade of this.blades) {

			var polygon = blade.col;
			var circle = me.circle.col;

			var collided = SAT.testPolygonCircle(polygon, circle, response);

			response.clear();

			if (collided == true) {
				me.hurt(blade.dmg);
				break;
			}
		}
	}

	hurt(blade_num, dmg) {
		let last_hurt = this.last_hurts[blade_num];
		
		if ((last_hurt == null) || (Date.now() - last_hurt > 800)) {
			this.last_hurts[blade_num] = Date.now();
			this.hp -= dmg;
			console.log("dmg", dmg);
			if (this.hp < 0) {
				audio.play("D");
			} else {
				audio.play("F");
			}
			this.hpsprite.scale.set(this.enemy_radius * this.hp/this.hp_max, this.enemy_radius);
		}
	}

	move_to(pos) {
		if (this.dead) {
			return;
		}
		this.cont.position.x = pos.x;
		this.cont.position.y = pos.y;

		this.circle.translate(pos.x, pos.y);
		for (let blade of this.blades) {
			blade.translate(pos.x, pos.y);
		}
	}

	delete() {
		this.dead = true;
		this.last_hurts = {};
		for (let blade of this.blades) {
			blade.kill();
		}
		if (this.interval != null) {
			clearInterval(this.interval);
		}
		if (this.cont.destroy != null) {
			this.cont.destroy();
		}
		
		// delete this.circle;
		// delete this.blades;

	}
	
}
function hp_color(hp) {
	if (hp <= 100) {
		return 0x00ff00;
	} else if (hp <= 200) {
		return 0x00ff22;
	} else {
		return 0xffff00;
	}



	// function rgbToHex(r, g, b) {
	//   return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	// }

	// function n_to_color(n) {
	// 	n -= 255;
	// 	if (n < 0) {
	// 		return rgbToHex(-n, 255, 0);
	// 	} else {
	// 		return rgbToHex(0, 255, n);
	// 	}
	// }
	// // 0 - 510
	// return n_to_color(hp / 100);
}







const RECHARGE_RATE = 0.01; // 0.01 per sec = 0.6 per min.
const MAX_ENERGY = 150;
const ENERGY_PER_GAME = 6;

var energy = {
	energy: null,
	init: async function() {
		const last_energy_amount = await sync.async_get("energy_amount") || MAX_ENERGY;
		const last_energy_refilled = await sync.async_get("energy_time") || Date.now();

		let seconds_elapsed = Math.floor((Date.now() - last_energy_refilled) / 1000);
		let recharged_level = Number(last_energy_amount) + Number(seconds_elapsed) * RECHARGE_RATE;
		this.energy = Math.min(MAX_ENERGY, recharged_level);
	},
	can_play: function() {
		return true; // disabled energy system.



		if (testing) {
			return true;
		}
		if (this.energy >= ENERGY_PER_GAME) {
			return true;
		} else {
			return false;
		}
	},
	join_game: async function() {
		// newcomer
		var lv7 = await sync.async_get(map_info[6].id+'-n') || 0;
		
		if (lv7 == 0) {
			this.energy -= ENERGY_PER_GAME / 2.2;
		} else {
			this.energy -= ENERGY_PER_GAME;
		}
		
		await sync.async_set("energy_amount", this.energy);
		await sync.async_set("energy_time", Date.now());
	},
	clock: function() {
		$("#energy").html(`Energy:<br>Infinite`);  // disabled energy system.
		return;  // disabled energy system.


		if (this.energy < MAX_ENERGY) {
			this.energy += RECHARGE_RATE;
		}
		var n = Math.round(this.energy * 100) / 100;
		var s = n.toString();
        if (s.indexOf('.') == -1) s += '.';
        while (s.length < s.indexOf('.') + 3) s += '0';

		$("#energy").html(`Energy:<br>${s}`);
	}
}







var join_params = {
	obj: {},
	init: function() {
		let hash = location.hash.slice(1);

		if (hash.length < 3) {
			this.obj = {};
			return;
		}
		if (!hash.includes("=")) {
			this.obj = {map: hash};
			return;
		}
		this.obj = JSON.parse('{"' + decodeURI(hash).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')

		window.location.hash = "";
	},
	open_destination: function() {
		if (this.obj.click != null) {
			$(`#${this.obj.click}`).click();
		} else if (this.obj.state != null) {
			state.set(this.obj.state);
		} else if (this.obj.map != null) {
			this.open_map(this.obj.map);
		} else {
			state.set("main_menu");
		}
	},
	open_map: function(load_map_id) {
        for (let map of map_info) {
            if (map.id == load_map_id) {
                console.log(`Loading ${map.id}`);
                state.set("playing", {map_id: map.id});
                return;
            }
        }
	}
}



var loader = {
	init: function (code_src) {
		return new Promise(resolve => {
			this.load_map(code_src, response => resolve(response));
		});
	},
    load_map: function(map_js, callback) {
        this.loadScript(map_js, function() {
            setTimeout(function() {
                callback("done");
            }, 100);
        });
    },
    loadScript: function(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onreadystatechange = callback;
        script.onload = callback;
        head.appendChild(script);
    }
}



const TEXTBOX_WIDTH = 100;

var maker = {
	app: function() {
		var pixi_app = new PIXI.Application({
		    width: window.innerWidth/1,
		    height: window.innerHeight/1,
		    transparent: false,
		    resolution: window.devicePixelRatio || 1,
		    backgroundColor: 0x000000
		});
		document.getElementById("canvas_container").appendChild(pixi_app.view);
		pixi_app.renderer.autoResize = false;

		pixi_app.renderer.resize(window.innerWidth, window.innerHeight);
		window.onresize = function()
		{
		    pixi_app.renderer.resize(window.innerWidth, window.innerHeight);
		}
		return pixi_app;
	},
	floating_label: function(text, pos, tweak_options={}) {
		var default_options = {
			fontFamily : 'Arial',
			fontSize: 14,
			fill : 0xF2545B,
			align : 'center'
		}
		var options2 = {
			...default_options,
			...tweak_options
		}
		var label = new PIXI.Text(text, options2);
		label.pivot.set(label.width / 2, 0);
		label.position.x = pos.x;
		label.position.y = pos.y;
		return label;
	},
	player_nametag: function(name) {
		const options = {
			fontFamily : 'Arial',
			fontSize: 14,
			fill : 0xF2545B,
			align : 'center'
		}
		var label = new PIXI.Text(name, options);
		label.pivot.set(label.width / 2, 28);
		return label;
	},
	background: function(asset) {
		let texture = assets[asset];
		var sprite = new PIXI.Sprite(texture);
		sprite.x = 0;
		sprite.y = 0;
		// sprite.scale.set(0.7, 0.7);
		// sprite.pivot.set(gsize/2, gsize * 3.2);
		bg_cont.addChild(sprite);
		return sprite;
	},
	player_hp1: function(team) {
		let texture = assets['hp1'];
		var sprite = new PIXI.Sprite(texture);
		sprite.pivot.set(-50*team, 17);
		sprite.scale.set(0.8, 0.8);
		return sprite;
	},
	player_hp2: function(team) {
		let texture = assets['hp2'];
		var sprite = new PIXI.Sprite(texture);
		sprite.pivot.set(-50*team, 17);
		sprite.scale.set(0.8, 0.8);
		return sprite;
	},
}




var map_info = [{
	id: "map1",
	msg: true
}, {
	id: "map2",
	msg: true
}, {
	id: "map3",
	msg: false
}, {
	id: "map4",
	msg: false
}, {
	id: "map5",
	msg: false
}, {
	id: "map5a",
	msg: false
}, {
	id: "map5b",
	msg: false
}, {
	id: "map6",
	msg: false
}, {
	id: "map6a",
	msg: false
}, {
	id: "map6b",
	msg: false
}, {
	id: "map7",
	msg: false
}, {
	id: "map8",
	msg: false
}, {
	id: "map9",
	msg: false
}, {
	id: "map10",
	msg: false
}, {
	id: "map10a",
	msg: false
}, {
	id: "map10b",
	msg: false
}, {
	id: "map11",
	msg: false
}, {
	id: "map12",
	msg: false
}, {
	id: "map13",
	msg: false
}, {
	id: "map14",
	msg: false
}, {
	id: "map15",
	msg: false
}, {
	id: "map16",
	msg: false
}, {
	id: "map17",
	msg: false
}, {
	id: "map18",
	msg: false
}]



const MOVEMENT_SPEED = 1.5;


var motion = {
	update: function(delta) {
		var next_pos_options = this.next_pos(delta);
		for (let next_pos of next_pos_options) {
			if (this.is_in_bounds(next_pos)) {
				me.move_to(next_pos);
				break;
			}
		}

		let follow_camera = {
			x: me.cont.position.x - app.screen.width / 2,
			y: me.cont.position.y - app.screen.height / 2
		}

		app.stage.pivot.copyFrom(follow_camera);

	},
	next_pos: function(delta) {

		var vx = 0;
		var vy = 0;

		if (controls.left) vx -= 1;
		if (controls.right) vx += 1;
		if (controls.up) vy -= 1;
		if (controls.down) vy += 1;
		
		// diagonal
		if (Math.abs(vx) + Math.abs(vy) == 2) {
			vx *= 0.71;
			vy *= 0.71;
		}

		vx *= upgrades.find_scale("speed");
		vy *= upgrades.find_scale("speed");

		return [{
			x: me.cont.position.x + vx * delta * MOVEMENT_SPEED,
			y: me.cont.position.y + vy * delta * MOVEMENT_SPEED
		}, {
			x: me.cont.position.x,
			y: me.cont.position.y + vy * delta * MOVEMENT_SPEED
		}, {
			x: me.cont.position.x + vx * delta * MOVEMENT_SPEED,
			y: me.cont.position.y
		}]
	},
	anim_start: function() {
		me.body.play();
	},
	anim_stop: function() {
		if ((!controls.left) && (!controls.right) && (!controls.up) && (!controls.down)) {
			me.body.stop();
			me.body.currentFrame = 0;
		}
	},
	is_in_bounds: function(next_pos) {
		if (next_pos.x < 0) {
			return false;
		}
		if (next_pos.y < 0) {
			return false;
		}
		if (next_pos.x > 550) {
			return false;
		}
		if (next_pos.y > 425) {
			return false;
		}
		return true;
	}
	
}



var news = {
	init: function() {

		this.get_news(function(data) {
			console.log(data);
			if (data != null) {
				if (data.html != null) {
					$("#news").html(data.html);
				}
				
			}
			
		});
	},
	get_news: function(callback) {

		try {
		  // https://developer.chrome.com/docs/extensions/mv3/xhr/	
			fetch("https://fn.onionfist.com/chrx_news?chrx=orbdag").then(function(res) {
				if (res.status !== 200) {
					callback(null);
				}
				res.json().then(data => {
					callback(data);
				});
			});

		}
		catch(err) {
		  console.log("News err", err.message);
		  callback(null);
		}
		
	}
}







//   "host_permissions": [
//     "https://www.google.com/"
//   ],


// chrome.runtime.sendMessage(
//     {contentScriptQuery: 'fetchUrl',
//      url: 'https://another-site.com/price-query?itemId=' +
//               encodeURIComponent(request.itemId)},
//     response => parsePrice(response.text()));




class Player {
	constructor(data) {
		this.cont = new PIXI.Container();
		app.stage.addChild(this.cont);

		this.hp = 100;
		this.hp_max = 100;


		this.circle = new Circle(0,0, 20);
		this.cont.addChild(this.circle.ren);

		this.blades = [];
		this.last_hurt = null;

		let textures = [];
		for (let i=0;i<4;i++) {
			let texture = assets['p_'+i];
			textures.push(texture);
		}
		this.body = new PIXI.AnimatedSprite(textures);
		this.body.loop = true;
		this.body.animationSpeed = 0.2;
		this.body.pivot.set(this.body.width / 2, this.body.height/2);
		this.cont.addChild(this.body);



		this.hpsprite = new PIXI.Graphics();
		this.hpsprite.beginFill(hp_color(this.hp));
		this.hpsprite.drawRect(0, 0, 40, 7);
		this.hpsprite.endFill();
		this.hpsprite.scale.set(1, 1);
		this.hpsprite.pivot.set(this.hpsprite.width/2, -2.5 * this.hpsprite.height);
		this.cont.addChild(this.hpsprite);


		var pos = {
			x: 300,
			y: 200
		}
		this.move_to(pos);
	}
	update(delta) {

		var response = new SAT.Response();
		for (let blade of this.blades) {
			blade.rotate(blade.spin * delta * 0.01);

			for (var i=enemies.length-1;i>=0;i--) {
				let enemy = enemies[i];
				var polygon = blade.col;
				var circle = enemy.circle.col;

				var collided = SAT.testPolygonCircle(polygon, circle, response);

				if (collided == true) {
					enemy.hurt(blade.id, blade.dmg);
					if (enemy.hp <= 0) {
						enemy.delete();
						enemies.splice(i, 1);
						map.spawn_wave();
					}
				}

				response.clear();
			}
			
		}
		
	}

	move_to(pos) {

		this.cont.position.x = pos.x;
		this.cont.position.y = pos.y;

		this.circle.translate(pos.x, pos.y);
		for (let blade of this.blades) {
			blade.translate(pos.x, pos.y);
		}
	}

	equip_dagger(weapon_id) {
		var dir_map = [-1, 1,1,-1];
		var ang_map = [-Math.PI/4, -Math.PI/4, -3*Math.PI/4, Math.PI/4];

		var ind = this.blades.length;
		let fn = weapons[weapon_id];

		var blade = fn(dir_map[ind] * upgrades.find_scale("spin"), ang_map[ind]);
		blade.dmg *= upgrades.find_scale("damage");
		// blade.num = ind;

		this.cont.addChild(blade.ren);
		this.cont.addChild(blade.ren2);
		this.blades.push(blade);
	}

	hurt(dmg) {
		if ((this.last_hurt == null) || (Date.now() - this.last_hurt > 800) || (dmg == 0)) {
			this.last_hurt = Date.now();
			this.hp -= dmg;
			
			if (dmg > 0) {
				audio.play("die");
			}
			
			if (this.hp <= 0) {
				state.set("death");
			}
			this.hpsprite.scale.set(1 * this.hp/this.hp_max, 1);
		}
	}
	destroy_daggers() {
		for (let blade of this.blades) {
			blade.kill();
			blade.ren.destroy();
			blade.ren2.destroy();
		}
		this.blades = [];
	}

	delete() {
	}
	
}



var popup = {
	init: async function() {

		$("#fullscreen_btn").click(function() {
			let link = "https://onionfist.com/orbdag/";
			link += `#${curr_map_id}`;
			window.open(link, '_blank').focus();
		});

		$("#play_btn").click(function() {
			popup.play_level(scorekeeper.next_map_id);
		});
		$("#levels_btn").click(function() {
			state.set("levels");
		});
		$("#menu_btn").click(function() {

			// if (deployment.is_oworld) {
			// 	state.set("goto_oworld");
			// 	return;
			// }
			if (state.dagsel_closeup == true) {
				state.set("dagsel");
			} else {
				state.set("main_menu");
			}
		});
		$("#dagsel_btn").click(function() {
			state.set("dagsel");
		});
		$("#credits_btn").click(function() {
			state.set("credits");
		});
		$("#upgrades_btn").click(function() {
			state.set("upgrades");
		});
		$("#settings_btn").click(function() {
			state.set("settings");
		});

		$("#death_respawn_btn").click(function() {
			state.set("playing", {map_id: curr_map_id});
		});

		$("#death_quit_btn").click(function() {
			$("#menu_btn").click();
		});

		$("#victory_next_btn").click(function() {
			popup.play_level(scorekeeper.next_map_id);
		});

		$("#victory_quit_btn").click(function() {
			$("#menu_btn").click();
		});

		$("#dagsel_closeup_action").click(function() {
			dagger_selection.dagsel_closeup_action_fn();
		});

		$("#no_energy_btn").click(function() {
			state.set("main_menu");
			// location.reload();
		});

		$("#daily_gift_img").click(function() {
			if (daily_gift.time_remaining == 0) {
				state.set("daily_gift");
			}
		})
		$("#daily_gift").click(function() {
			if (daily_gift.time_remaining == 0) {
				state.set("daily_gift");
			}
		});
		$("#dg_claim_btn").click(function() {
			audio.play("levelup");
			state.set("main_menu");
		});

		$("#afk_button").click(function() {
			webext.active_again();
		});


		$("#erase_yes").click(function() {
			state.set("data_erase_confirm");
		});
		$("#erase_no").click(function() {
			state.set("main_menu");
		});
		$("#erase_done").click(function() {
			state.set("main_menu");
		});
		$("#erase_data_btn").click(function() {
			state.set("data_erase_ask");
		});

	},
	refresh_levels_page: async function() {
		$("#levels").html("");
		var i=0;
		for (let map of map_info) {
			i+=1;
			var map_scores = await scorekeeper.get_map_stat(map.id, false);

			var lock_type = "locked";
			if ((map_scores.exp > 0) || (testing)) {
				lock_type = "complete";
			}
			if (map.id == scorekeeper.next_map_id) {
				lock_type = "next_level";
			}
			$("#levels").append(`<div id="map_${map.id}" class="button ${lock_type}">Level ${i}</div>`);

			if (lock_type != "locked") {
				$(`#map_${map.id}`).click(function() {
					popup.play_level(map.id);
				});
			}
			
		}
	},
	play_level: function(map_id) {
		if (this.state == "playing") {
			return;
		}
		var info;
		for (let map of map_info) {
			if (map.id == map_id) {
				info = map;
				break;
			}
		}
		if (info == null) {
			console.error("Error");
			return;
		}

		var params = {map_id: map_id};
		if (info.msg == true) {
			state.set("story", params);
		} else {
			state.set("playing", params);
		}

	}
}






const INF = 9999999;

var scorekeeper = {
	info: {},
	next_map_index: null,
	next_map_id: null,
	init: async function() {
		this.info = await this.all_promise();
		for (let i=0;i<this.info.length;i++) {
			let map = this.info[i];
			if (map.exp == 0) {
				this.next_map_index = i;
				this.next_map_id = map.id;
				break;
			}
		}
	},
	get_map_stat: async function(map_id, refresh_data=true) {
		if (refresh_data == true) {
			return await this.map_promise(map_id);
		} else {
			for (var i=0;i<this.info.length;i++) {
				if (this.info[i].id == map_id) {
					return this.info[i];
				}
			}
		}
		
	},
	add_map_exp: async function(map_id) {
		// get
		var info = await this.map_promise(map_id);

		// add
		var new_exp = info.exp + 1;

		// set
		await new Promise((resolve, reject) => {
			sync.set(map_id+"-n", new_exp, function() {
				resolve();
			});
		});
	},
	all_promise: function() {
		return new Promise((resolve, reject) => {
			var map_promises = [];
			for (const map of map_info) {
				map_promises.push(scorekeeper.map_promise(map.id));
			}
			Promise.all(map_promises).then((values) => {
				resolve(values);
			});
		});
	},
	map_promise: function(this_map_id) {
		return new Promise((resolve, reject) => {
			sync.get(this_map_id+"-n", function(data) {
				sync.get(this_map_id+"-h", function(data2) {
					var map_exp = (data == null) ? 0 : Number(data);
					var map_tim = (data2 == null) ? INF : Number(data2);

					resolve({
						id: this_map_id,
						exp: map_exp,
						tim: map_tim
					});
				});
			});
		});
	}
}




var settings_blueprint = [
	{
		id: "background_music",
		name: "Background Music",
		options: ["On", "Off"],
		default_index: 0,
		update: (prev_option, new_option) => {},
	},
	{
		id: "sound_effects",
		name: "Sound Effects",
		options: ["On", "Off"],
		default_index: 0,
		update: (prev_option, new_option) => {},
	},
	{
		id: "auto_restart",
		name: "Auto Restart",
		options: ["On", "Off"],
		default_index: 1,
		update: (prev_option, new_option) => {},
	},
];


var settings = {
	init: function() {
		for (let setting of settings_blueprint) {
			this.init_setting(setting);
		}
	},
	init_setting: async function(setting) {
		// get data
		var retrieved_data = await this.setting_promise(setting.id);
		if (retrieved_data == null) {
			retrieved_data = setting.options[setting.default_index];
		}
		console.log(setting.id, retrieved_data);

		this[setting.id] = retrieved_data;

		var contHTML = `<div class="setting" id="setting_${setting.id}"><h2>${setting.name}</h2></div>`;

		$("#settings").append(contHTML);

		for (let option of setting.options) {
			this.init_option(setting, option);
		}
	},
	init_option: function(setting, option) {
		var optionHTML = `<div class="setting_option" id="option_${setting.id}_${option}">${option}</div>`;
		$(`#setting_${setting.id}`).append(optionHTML);

		this.update_option_css(setting.id, option);

		var jobj = $(`#option_${setting.id}_${option}`);
		jobj.click(function() {
			settings.set(setting.id, option);
		});
	},
	update_option_css: function(setting_id, option_id) {
		var is_selected = false;
		if (this[setting_id] == option_id) {
			is_selected = true;
		}
		var jobj = $(`#option_${setting_id}_${option_id}`);
		if (is_selected) {
			jobj.css("border-color", "#6BFA8A");
		} else {
			jobj.css("border-color", "black");
		}
	},
	setting_promise: function(setting_id) {
		return new Promise((resolve, reject) => {
			sync.get(setting_id, function(data) {
				resolve(data);
			});
		});
	},
	set: function(setting_id, option_id) {

		var setting;
		var setting_index = -1;
		for (var i=0;i<settings_blueprint.length;i++) {
			if (settings_blueprint[i].id == setting_id) {
				setting = settings_blueprint[i];
				setting_index = i;
				break;
			}
		}

		var prev_option_index = setting.options.indexOf(this[setting_id]);
		var prev_option = setting.options[prev_option_index];

		var new_option = option_id;

		// RAM

		settings_blueprint[setting_index].update(prev_option, new_option);
		this[setting_id] = new_option;
		this.update_option_css(setting_id, prev_option);
		this.update_option_css(setting_id, new_option);

		// STORAGE
		// sync.

		sync.set(setting_id, new_option, function() {

		});

	}
}






var size = {
	popup: function() {
		if (deployment.is_chrome_ext) {
			$("body").css("width", "340px");
			$("body").css("height", "500px");
		} else {
			$("body").css("width", "100%");
			$("body").css("height", "100%");
			$("#menu_btn").css("left", "calc(50% - 160px)");
		}
	},
	ingame: function() {
		if (deployment.is_chrome_ext) {
			$("body").css("width", "600px");
			$("body").css("height", "500px");
		} else {
	   		$("body").css("width", "100%");
			$("body").css("height", "100%");
			
			$("#menu_btn").css("left", "10px");
		}

		window.onresize();
	}
}



var app;
var bg_cont;
var background;
var midground;
var me;
var enemies = [];

var wave_num = null;

var start = {
	init: function() {
		app = maker.app();
		bg_cont = new PIXI.Container();
		app.stage.addChild(bg_cont);
		me = new Player();

	}
}



var curr_map_id = null;
var game_num = 0;

var state_blueprint = [{
	id: "loading",
	on_focus: () => {
		$("#controls_overlay").hide();
		$("#fullscreen_btn").hide();
	},
	on_blur: () => {}
}, {
	id: "playing",
	on_focus: async (params) => {
		// energy
		if (!energy.can_play()) {
			state.set("no_energy");
			return;
		} else {
			energy.join_game();
		}

		game_num += 1;
		var i = 0;
		for (let map of map_info) {
			i += 1;
			if (map.id == params.map_id) {
				wave_num = i;
				break;
			}
		}
		curr_map_id = params.map_id;
		await loader.init(`maps/${params.map_id}.js`);
		background = maker.background(map.background);
		await map.init();

		me.destroy_daggers();
		
		var daggers = dagger_selection.equipped;
		for (let dagger of daggers) {
			me.equip_dagger(dagger);
			action_manager.equip_dagger(dagger);
		}
		me.hp = 100 * upgrades.find_scale("health");
		me.max_hp = 100 * upgrades.find_scale("health");
		me.hurt(0);

		audio.play_song("stairways");
		
		size.ingame();

		if (i == 1) {
			$("#controls_overlay").show();
		}

		$("#fullscreen_btn").show();

        
	},
	on_blur: () => {
		game_num += 1;
		// game reset
		for (let enemy of enemies) {
			enemy.delete();
		}
		for (let bullet of bullet_manager.bullets) {
			bullet.delete();
		}
		enemies = [];

		var pos = {
			x: 300,
			y: 200
		}
		me.move_to(pos);
		me.destroy_daggers();
		
		action_manager.reset();

		if (background != null) background.destroy();
		background = null;

		audio.stop_song();


		// visual reset
		size.popup();
		$("#controls_overlay").hide();
		$("#fullscreen_btn").hide();

        

	}
}, {
	id: "story",
	on_focus: async (params) => {
		var url = `msgs/${params.map_id}.js`;
		await loader.init(url);
		await msg.init(params.map_id);
	},
	on_blur: () => {
		story.reset();
	}
}, {
	id: "main_menu",
	on_focus: () => {
		$("#menu_btn").hide();
	},
	on_blur: () => {
		$("#menu_btn").show();
	}
}, {
	id: "levels",
	on_focus: () => {
		popup.refresh_levels_page();
	},
	on_blur: () => {}
}, {
	id: "death",
	on_focus: () => {
		if (settings.auto_restart == "On") {
			setTimeout(function() {
				$("#death_respawn_btn").click();
			}, 300);
		}
	},
	on_blur: () => {}
}, {
	id: "daily_gift",
	on_focus: () => {
		daily_gift.open();
	},
	on_blur: () => {
		upgrades.init();
	}
}, {
	id: "no_energy",
	on_focus: () => {
	},
	on_blur: () => {}
}, {
	id: "data_erase_ask",
	on_focus: () => {

	},
	on_blur: () => {}
}, {
	id: "data_erase_confirm",
	on_focus: async () => {
		await webext.clear_storage_data();
		await sync.async_set("overwrite_web", true);
	},
	on_blur: () => {
		location.reload();
	}
}, {
	id: "victory",
	on_focus: async () => {

		// if (deployment.is_oworld) {
		// 	$("body").hide();
		// }
		
		audio.play("levelup");

		let n = await sync.async_get(curr_map_id+"-n") || 0;
		var i = map_info.map(v => v.id).indexOf(curr_map_id);

		upgrades.reward_level_clear(i, n);
		dagger_selection.reward_level_clear(i, n);

		$("#dg_dagsel_reward").html(``);
		$("#dg_dagsel_reward_img").attr('src', ``);

		scorekeeper.add_map_exp(curr_map_id);
		setTimeout(function() {
			scorekeeper.init();
		}, 200);

		
		
	},
	on_blur: async () => {
		
		
	}
}, {
	id: "settings",
	on_focus: () => {},
	on_blur: () => {}
}, {
	id: "credits",
	on_focus: () => {
	},
	on_blur: () => {}
}, {
	id: "dagsel",
	on_focus: () => {
	},
	on_blur: () => {}
}, {
	id: "dagsel_closeup",
	on_focus: (params) => {
		$("#menu_btn_img").attr("src", "assets/svgs/back.svg");
		let weapon = weapon_blueprint[params.weapon_id];
		let img_src = (weapon.action == null) ? `${params.weapon_id}.png` : `${params.weapon_id}_ready.png`;
		$("#dagsel_closeup_img").attr("src", `assets/weapons/${img_src}`);
		$("#dagsel_closeup_name").text(params.name);
		$("#dagsel_closeup_stats").html(`Damage: ${params.dmg}<br>Spin: ${params.spin}<br>Range: ${params.range}<br>Tier: ${params.tier}`);
		$("#dagsel_closeup_action_enchant").html(action_names[params.action || "none"]);

		if (params.is_equipped) {
			$("#dagsel_closeup_action").html("Un-equip");
			dagger_selection.dagsel_closeup_action_fn = () => {
				dagger_selection.unequip_dagger(params.weapon_id);
			}
		} else {
			$("#dagsel_closeup_action").html("Equip");
			dagger_selection.dagsel_closeup_action_fn = () => {
				dagger_selection.equip_dagger(params.weapon_id);
			}
		}
	},
	on_blur: () => {
		$("#menu_btn_img").attr("src", "assets/svgs/list.svg");
	}
}, {
	id: "error",
	on_focus: (params) => {
		$("#error_h1").text(params.h1);
		$("#error_p").text(params.p);
		$("#error_action").click(function() {
			state.set(params.target);
		});
	},
	on_blur: () => {}
}, {
	id: "upgrades",
	on_focus: () => {
	},
	on_blur: () => {}
}, {
	id: "afk",
	on_focus: () => {
		$("#menu_btn").hide();
	},
	on_blur: () => {
		$("#menu_btn").show();
	}
}, {
	id: "goto_oworld",
	on_focus: (params) => {
		let show_results = params.show_results || false;
		fire("game_end", [show_results]);
	},
	on_blur: () => {
	}
}];



var state = {
	ignore_id: null,
	index: 0, // curr state index
	init: function() {
		for (let option of state_blueprint) {
			// html
			var screen = $(`#screen_${option.id}`);
			if (screen.length == 1) {
				screen.css("visibility", "visible");
				screen.hide();
			}
			// prop
			if (option.id == state_blueprint[this.index].id) {
				this[option.id] = true;
			} else {
				this[option.id] = false;
			}
		}

		let init_state = state_blueprint[this.index];
		$(`#screen_${init_state.id}`).show();
		init_state.on_focus();
	},
	set: async function(new_id, params={}) {
		if (this.ignore_id == new_id) {
			return;
		}
		let new_i = this.get_index(new_id);

		var prev_state = state_blueprint[this.index];
		var curr_state = state_blueprint[new_i];

		console.log(prev_state.id, ">", curr_state.id);

		if (prev_state.id == curr_state.id) {
			return;
		}

		// apply
		this.index = new_i;

		$(`#screen_${prev_state.id}`).hide();
		this[prev_state.id] = false;
		

		await prev_state.on_blur();
		await curr_state.on_focus(params);

		this[curr_state.id] = true;
		$(`#screen_${curr_state.id}`).show();
		fire("game_state_changed", [curr_state.id]);
	},
	ignore: function(ignore_id) {
		this.ignore_id = ignore_id;
	},
	get_index: function(id) {
		var i = 0;
		for (let option of state_blueprint) {
			if (option.id == id) {
				return i;
			}
			i += 1;
		}
		console.error("State Failed to get index");
		return -1;
	}
}




var story = {
	scene_index: -1,
	scenes: [],
	init: function() {
		$("#story_next_btn").click(function() {
			story.next_scene();
		});
	},
	reset: function() {
		this.scene_index = -1;
		this.scenes = [];
	},
	ready: function(scenes, map_id) {
		this.map_id = map_id;
		this.scenes = scenes;
		this.next_scene();

	},
	next_scene: function() {
		this.scene_index += 1;
		if (this.scene_index < this.scenes.length) {
			var scene = this.scenes[this.scene_index];
			var img_src = (scene.img == null) ? "" : "assets/cutscenes/"+scene.img;

			// $("#story_img").attr("src", img_src);
			$("#story_txt").html(scene.txt);
		} else {
			var params = {map_id: this.map_id};
			state.set("playing", params);
		}

		
	}
}



var sync = {
    prefix: config.sync_id,
    oworld_unsaved: {},
    oworld_data: {},
    oworld_pending: false,
    key: function(key) {
        if (this.prefix == "") {
            return key;
        }
        if (key.slice(0,2) != this.prefix) {
            return this.prefix + key;
        } else {
            return key;
        }
    },
    keys: function(keys) {
        return keys.map(v => this.key(v));
    },
    init: async function() {
        // use chrome storage or local storage?
        if (deployment.is_oworld) {
            console.log("OWORLD DETECTED")
            this.prefix = "";
            await fire("game_sync_init");

        } else if (!deployment.is_chrome_ext) {
            if (window.chrome == null) {
                window.chrome = {};
            }
            chrome.storage = {
                sync: {},
                local: {}
            };
            var set_fn = function(b, c) {
                var a = Object.keys(b);
                localStorage.setItem(a, b[a]);
                c();
            };

            var get_fn = function(b, c) {
                var a = b[0],
                    e = localStorage.getItem(a),
                    d = {};
                d[a] = e;
                c(d);
            };

            chrome.storage.local.set = set_fn;
            chrome.storage.local.get = get_fn;
        }
    },
    set: function(key, val, callback) {
        var saveObject = {};
        key = this.key(key);
        saveObject[key] = val;

        chrome.storage.local.set(saveObject, function(){
            webext.record_set(key, val);
            if (callback) callback();
        });
    },
    get: function(key, callback) {
        key = this.key(key);
        chrome.storage.local.get([key], function(items) {
            let local_data = items[key];
            if (callback) callback(local_data);
        });
    },
    async_get: function(key) {
        return new Promise((resolve, reject) => {
            sync.get(key, function(data) {
                resolve(webext.to_num(data));
            });
        });
    },
    async_set: function(key, val) {
        return new Promise((resolve, reject) => {
            sync.set(key, val, function() {
                resolve();
            });
        });
    },
    r: function(key) {
        this.get(key, (data) => {
            console.log(">>",data);
        });
    }
}




var update = {
	interval: null,
	init: function() {
		// Listen for animate update
		app.ticker.add((delta) => {
			this.render(delta);
		});
		this.interval = setInterval(this.clock, 1000);
	},
	render: function(delta) {
		if (state.playing) {
			me.update(delta);
			motion.update(delta);

			for (let enemy of enemies) {
				enemy.update(delta);
			}
			for (let bullet of bullet_manager.bullets) {
				bullet.update(delta);
			}
		}

	},
	clock: function() {
		energy.clock();
		daily_gift.clock();
	}
}




var MAX_LEVEL = 7;
var upgrade_blueprint = {
	damage: {
		name: "Damage",
		// for each level, how much you need to pay
		// to get to the next level
		costs: [0, 1000, 3000, 9000, 27000, 81000, 81000*3, 81000*9],
		scale_fn: function(level) {
			return 1 + (level - 1) / 3;
		}
	},
	speed: {
		name: "Speed",
		costs: [0, 1000, 3000, 9000, 27000, 81000, 81000*3, 81000*9],
		scale_fn: function(level) {
			return 1 + (level - 1) / 7;
		}
	},
	spin: {
		name: "Spin",
		costs: [0, 1000, 3000, 9000, 27000, 81000, 81000*3, 81000*9],
		scale_fn: function(level) {
			return 1 + 0.4 + (level - 1) / 3;
		}
	},
	health: {
		name: "Armour",
		costs: [0, 1000, 3000, 9000, 27000, 81000, 81000*3, 81000*9],
		scale_fn: function(level) {
			return 1 + (level - 1) / 5;
		}
	}
}


var upgrades = {
	xp: null,
	find_scale: function(upgrade) {
		return upgrade_blueprint[upgrade].scale_fn(upgrades[upgrade]);
	},
	init: async function() {
		$("#upgrades").html("");
		for (let upgrade_id in upgrade_blueprint) {
			let level = await sync.async_get(upgrade_id) || 1;
			upgrade_blueprint[upgrade_id].level = level;
			this[upgrade_id] = level;
		}

		for (let upgrade_id in upgrade_blueprint) {
			this.init_upgrade(upgrade_id);
		}

		this.xp = await sync.async_get("xp") || 0;
		if (testing) {
			this.xp = 9999999;
		}
		// this.xp = Number(this.xp);

		$("#upgrades_xp").text(`${this.xp} XP`);
	},
	init_upgrade: function(upgrade_id) {
		let upgrade = upgrade_blueprint[upgrade_id];
		let {name, level, costs} = upgrade;
		let cost = costs[level];

		var circles = "";
		for (var i=0;i<level;i++) {
			circles += `<img class="circle" src="assets/svgs/circle-fill.svg">`;
		}
		for (var i=level;i<MAX_LEVEL;i++) {
			circles += `<img class="circle" src="assets/svgs/circle.svg">`;
		}

		let btn = `<div class="button upgrade_btn" id="upgrade_btn_${upgrade_id}">Upgrade (${cost}XP)</div>`;
		if (level == MAX_LEVEL) {
			btn = "";
		}
		let html = `
			<div>
				<div class="upgrade_row">
					<div class="upgrade_name">${name}</div>
					${btn}
				</div>
				<div class="circles">
					${circles}
				</div>
				
			</div>
		`;
		$("#upgrades").append(html);

		$(`#upgrade_btn_${upgrade_id}`).click(function() {
			upgrades.upgrade(upgrade_id);
		});
	},
	upgrade: async function(upgrade_id) {
		let level = this[upgrade_id];
		let cost = upgrade_blueprint[upgrade_id].costs[level];
		if ((this.xp >= cost) && (level < MAX_LEVEL)) {
			this.xp -= cost;
			await sync.async_set("xp", this.xp);
			await sync.async_set(upgrade_id, level + 1);
			audio.play("levelup");
		}
		this.init();
	},
	reward_level_clear: async function(i, n) {
		let xp_per_clear = [1000, 300, 50, 10, 0];
		var xp_amount = (n < xp_per_clear.length) ? xp_per_clear[n] : 0; // first clear = max XP.
		xp_amount *= 1 + i / 20; // later levels = more XP.

		xp_amount = Math.round(xp_amount);

		$("#xp_reward").html(`Gained ${xp_amount} XP!`);

		await sync.async_set("xp", this.xp + xp_amount);
		this.init();
	}

}






var weapon_blueprint = {
	starter_sword: {
		name: "Cutter Blade",
		player:true,
		nodes: [
			[4, 29],
			[37, 30],
			[37, 42],
			[17, 44]
		],
		dmg: 100,
		offsetX: 0,
		offsetY: 0,
		spin: 2,
		tier: 1
	},
	spear1: {
		name: "Arrow",
		player:true,
		nodes: [
			[4, 34],
			[50, 34],
			[50, 44],
			[4, 44]
		],
		dmg: 120,
		offsetX: 0,
		offsetY: 0,
		spin: 2,
		tier: 1
	},
	kitchen_knife: {
		name: "Kitchen Knife",
		player:true,
		nodes: [
			[4, 34],
			[50, 34],
			[50, 44],
			[4, 44]
		],
		dmg: 130,
		offsetX: 0,
		offsetY: 0,
		spin: 1.7,
		tier: 1
	},
	spear2: {
		name: "Assasin's Dagger",
		player:true,
		nodes: [
			[4, 34],
			[50, 34],
			[50, 44],
			[4, 44]
		],
		dmg: 150,
		offsetX: 0,
		offsetY: 0,
		spin: 2.6,
		tier: 2
	},
	bullet: {
		name: "Bullet Stab",
		player:true,
		nodes: [
			[4, 34],
			[50, 34],
			[50, 44],
			[4, 44]
		],
		dmg: 130,
		offsetX: 0,
		offsetY: 0,
		spin: 4,
		tier: 3
	},
	banana: {
		name: "Banana Stab",
		player:true,
		nodes: [
			[4, 34],
			[50, 34],
			[50, 44],
			[4, 44]
		],
		dmg: 180,
		offsetX: 0,
		offsetY: 0,
		spin: 1,
		tier: 2
	},







	short_dagger: {
		name: "Backstabber",
		player:true,
		nodes: [
			[20, 6],
			[52, 6],
			[36, 65]
		],
		dmg: 80,
		offsetX: 0,
		offsetY: 0,
		spin: 2,
		tier: 2
	},
	katana: {
		name: "Katana",
		player:true,
		nodes: [
			[20, 6],
			[52, 6],
			[36, 65]
		],
		dmg: 50,
		offsetX: 0,
		offsetY: -30,
		spin: 3,
		tier: 3
	},
	cool1: {
		name: "Assasin's Spear",
		player:true,
		nodes: [
			[20, 6],
			[52, 6],
			[36, 65]
		],
		dmg: 90,
		offsetX: 0,
		offsetY: 0,
		spin: 2.4,
		tier: 3
	},
	pixel1: {
		name: "Pixeled Knife",
		player:true,
		nodes: [
			[20, 6],
			[52, 6],
			[36, 65]
		],
		dmg: 70,
		offsetX: 0,
		offsetY: 0,
		spin: 1.8,
		tier: 1
	},
	diaknife: {
		name: "Dia Knife",
		player:true,
		nodes: [
			[20, 6],
			[52, 6],
			[36, 65]
		],
		dmg: 60,
		offsetX: 0,
		offsetY: 0,
		spin: 1.2,
		tier: 1
	},
	carrotknife: {
		name: "Carrot Cutter",
		player:true,
		nodes: [
			[20, 6],
			[52, 6],
			[36, 65]
		],
		dmg: 70,
		offsetX: 0,
		offsetY: 0,
		spin: 2.5,
		tier: 2
	},

	// new weapons

	axe: {
		name: "axe",
		player: true,
		nodes: [
			[33,2],
			[42,60],
			[14,61]
		],
		dmg: 110,
		offsetX: 0,
		offsetY: 0,
		spin: 1.7,
		tier: 3
	},
	battle_axe: {
		name: "battle_axe",
		player: true,
		nodes: [
			[33,2],
			[60,70],
			[10,70]
		],
		dmg: 140,
		offsetX: 0,
		offsetY: 0,
		spin: 2,
		tier: 4,
		action: "spin"
	},
	claw: {
		name: "claw",
		player: true,
		nodes: [
			[9,9],
			[45,9],
			[29,49]
		],
		dmg: 190,
		offsetX: 0,
		offsetY: 0,
		spin: 3.5,
		tier: 3
	},
	eye_piercer: {
		name: "eye_piercer",
		player: true,
		nodes: [
			[25,5],
			[45,5],
			[36,60]
		],
		dmg: 180,
		offsetX: 0,
		offsetY: 0,
		spin: 2.3,
		tier: 4,
		action: "throw"
	},
	long_axe: {
		name: "long_axe",
		player: true,
		nodes: [
			[41,10],
			[51,80],
			[17,74]
		],
		dmg: 80,
		offsetX: 0,
		offsetY: 0,
		spin: 1.3,
		tier: 2
	},
	mace: {
		name: "mace",
		player: true,
		nodes: [
			[44,5],
			[65,80],
			[30,80]
		],
		dmg: 100,
		offsetX: 0,
		offsetY: 0,
		spin: 1.2,
		tier: 4,
		action: "spin"
	},
	rocket: {
		name: "rocket",
		player: true,
		nodes: [
			[16,9],
			[51,9],
			[36,70]
		],
		dmg: 170,
		offsetX: 0,
		offsetY: 0,
		spin: 2,
		tier: 4,
		action: "throw"
	},
	staff: {
		name: "staff",
		player: true,
		nodes: [
			[44,5],
			[60,85],
			[33,80]
		],
		dmg: 110,
		offsetX: 0,
		offsetY: 0,
		spin: 1.8,
		tier: 3
	},
	wolverine: {
		name: "wolverine",
		player: true,
		nodes: [
			[30,7],
			[47,8],
			[55,70],
			[25,70]
		],
		dmg: 175,
		offsetX: 0,
		offsetY: 0,
		spin: 1.5,
		tier: 4,
		action: "scare"
	},



	// ENEMY WEAPONS

	longsword: {
		name: "longsword",
		nodes: [
			[64, 0],
			[84, 35],
			[64, 128],
			[44, 35]
		],
		dmg: 30,
		offsetX: 0,
		offsetY: -10,
		spin: 2,
	},
	broom: {
		name: "broom",
		nodes: [
			[80, 12],
			[110, 86],
			[47, 116],
			[17, 79]
		],
		dmg: 1000,
		offsetX: 20,
		offsetY: 0,
		spin: 1,
	},
	speedsword: {
		name: "speedsword",
		nodes: [
			[50, 9],
			[70, 40],
			[30, 40],
			[44, 35]
		],
		dmg: 50,
		offsetX: 0,
		offsetY: -10,
		spin: 7,
	},
	shield: {
		name: "shield",
		nodes: [
			[5, 4],
			[77, 6],
			[77, 14],
			[6, 15]
		],
		dmg: 80,
		offsetX: 0,
		offsetY: -33,
		spin: 2,
	},
	pendulum: {
		name: "pendulum",
		nodes: [
			[21, 3],
			[48, 23],
			[28, 49],
			[2, 30]
		],
		dmg: 50,
		offsetX: 0,
		offsetY: -140,
		spin: 2,
	},
	slow_pendulum: {
		name: "slow_pendulum",
		nodes: [
			[21, 3],
			[48, 23],
			[28, 49],
			[2, 30]
		],
		dmg: 60,
		offsetX: 0,
		offsetY: -140,
		spin: 2,
	},
	long_pendulum: {
		name: "long_pendulum",
		nodes: [
			[21, 3],
			[48, 23],
			[28, 49],
			[2, 30]
		],
		dmg: 80,
		offsetX: 0,
		offsetY: -140,
		spin: 2,
	},
	butterfly: {
		name: "butterfly",
		nodes: [
			[65, 10],
			[85, 10],
			[100, 110],
			[80, 150],
			[60, 157],
			[53, 68]
		],
		dmg: 1000,
		offsetX: 0,
		offsetY: -10,
		spin: 8,
	},
	lol_fist: {
		name: "lol_fist",
		nodes: [
			[15, 22],
			[73, 33],
			[74, 54],
			[27, 53],
			[11, 44]
		],
		dmg: 80,
		offsetX: 0,
		offsetY: -20,
		spin: 2,
	},
	superfast: {
		name: "superfast",
		nodes: [
			[6, 11],
			[42, 11],
			[44, 16],
			[12, 16]
		],
		dmg: 30,
		offsetX: 0,
		offsetY: 0,
		spin: 30,
	},
	tiny_fast_dagger: {
		name: "tiny_fast_dagger",
		nodes: [
			[16, 5],
			[34, 5],
			[25, 50]
		],
		dmg: 40,
		offsetX: 0,
		offsetY: 0,
		spin: 5,
	},
	wearable: {
		name: "wearable",
		nodes: [
			[9, 9],
			[31, 9],
			[31, 31],
			[9, 31]
		],
		dmg: 30,
		offsetX: 0,
		offsetY: 0,
		spin: 5,
	},


	
}

var weapons = {};

var weapon_manager = {
	init: function() {
		for (let weapon_id in weapon_blueprint) {
			this.compute_range(weapon_id);
			this.init_weapon(weapon_id);
		}
	},
	compute_range: function(weapon_id) {
		let {nodes, offsetY} = weapon_blueprint[weapon_id];
		let max_y = 0;
		for (let [x,y] of nodes) {
			if (y > max_y) max_y = y;
		}
		weapon_blueprint[weapon_id].range = offsetY + max_y;
		weapon_blueprint[weapon_id].id = weapon_id;
	},
	init_weapon: function(weapon_id) {
		let asset = `w_${weapon_id}`;
		let {nodes, offsetX, offsetY, spin, dmg} = weapon_blueprint[weapon_id];

		let fn = function(turn_dir, _init_r, overrideOffsetY, overrideSpin) {
			let init_r = weapon_manager.angle(_init_r);
			var final_spin;
			if (turn_dir != null) {
				final_spin = spin * turn_dir;
			} else {
				final_spin = spin;
			}
			if (overrideOffsetY != null) {
				offsetY = overrideOffsetY;
			}

			if (overrideSpin != null) {
				final_spin = overrideSpin;
			}
			
			return new Blade(asset, nodes, offsetX, offsetY, final_spin, init_r, dmg);
		};

		weapons[weapon_id] = fn;

		// delete weapon_blueprint[weapon_id].nodes;
		// delete weapon_blueprint[weapon_id].offsetX;
		// delete weapon_blueprint[weapon_id].offsetY;
	},
	angle: function(angle) {
		if (angle == null) {
			return Math.PI*2*Math.random();
		} else {
			return angle;
		}
		
	}
}





var webext = {
    last_game_boot_time: null,
    init: async function() {
        if (deployment.is_oworld) {
            return;
        }
        if (deployment.is_localhost) {
            return;
        }
        
        // GAME ID
        let gid = await sync.async_get("game_id");
        if (gid == null) {
            gid = Date.now() + "-" + Math.floor(Math.random() * 900000);
            await sync.async_set("game_id", gid);
        }
        console.log("gid", gid);

        // BOOT TIME
        this.last_game_boot_time = Date.now()
        await this.set_from_web("last_game_boot_time", this.last_game_boot_time);
        if (deployment.is_chrome_ext) {
            await sync.async_set("last_game_boot_time", this.last_game_boot_time);
        }

        
        
        
    },
    afk: function() {
        console.log("AFK");
        state.set("afk");
    },
    active_again: async function() {
        console.log("Active button clicked.");
        $("#afk_button").hide();
        let last_game_boot_time = await this.get_from_web(["last_game_boot_time"]); //await sync.async_get("last_game_boot_time");
        last_game_boot_time = last_game_boot_time[sync.key("last_game_boot_time")];
        console.log("last_game_boot_time", last_game_boot_time);
        if (last_game_boot_time == this.last_game_boot_time) {
            state.set("main_menu");
        } else {
            location.reload();
        }

        $("#afk_button").show();
    },
    get_progress: function() {
        if (deployment.is_oworld) {
            return;
        }
        var storage_vars = [];
        for (let i = 0; i < localStorage.length; i++)   {
            let key = localStorage.key(i);
            if ((key.slice(0,2) == sync.prefix) && (key.slice(-2) == "-n")) {
                storage_vars.push(key);
            }
            // console.log( + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
        }
        var num_maps_complete = 0;
        for (let storage_var of storage_vars) {
            var n = localStorage.getItem(storage_var) || 0;
            if (n > 0) {
                num_maps_complete += 1;
            }
        }
        console.log("storage_vars", storage_vars);
        return num_maps_complete;
        // localStorage.getItem(
    },
    record_set: async function(key, val) {
        if (deployment.is_oworld) {

        } else if (deployment.is_chrome_ext == true) {
            key = key.slice(2);
            if (key == "altered_vars") {
                return;
            }
            var altered_vars = await sync.async_get("altered_vars") || JSON.stringify([]);
            altered_vars = JSON.parse(altered_vars);

            if (altered_vars.indexOf(key) >= 0) {
                return;
            }

            altered_vars.push(key);

            await sync.async_set("altered_vars", JSON.stringify(altered_vars));
        } else {
            await this.set_from_web(key, val);
        }
    },
    worker_req: function(data) {
        return new Promise(async (resolve, reject) => {
            if (chrome.runtime == null) {
                console.log("no runtime, maybe due to localhost.");
                resolve(null);
                return;
            }
            
            const chrx_ids = [config.chrx_id, config.dev_chrx_id];
            console.log("chrx_ids", chrx_ids);

            for (const chrx_id of chrx_ids) {
                let resp = await webext.worker_one(chrx_id, data);
                if (resp != null) {
                    console.log("resp", resp);
                    resolve(resp);
                    return;
                }
            }
            resolve(null);
        });
    },
    worker_one: function(chrx_id, data) {
        return new Promise((resolve, reject) => {
            try {
                chrome.runtime.sendMessage(chrx_id, data, function(response) {
                    resolve(response);
                    return;
                });
            } catch (error) {
                console.log("Err", error);
                resolve(null);
            }
        });
    },
    ping_from_web: function() {
        if (deployment.is_oworld) {
            return;
        }

        return this.worker_req({code: "ping_from_web"});
    },
    get_code: function(code) {
        if (deployment.is_oworld) {
            return;
        }

        return this.worker_req({code: code});
    },
    send_code: function(code, modif={}) {
        if (deployment.is_oworld) {
            return;
        }

        var obj = {code: code};
        obj = {
            ...obj,
            ...modif
        }

        return this.worker_req(obj);

    },
    get_from_web: function(keys) {
        if (deployment.is_oworld) {
            return;
        }
        
        let obj = {keys: sync.keys(keys), code: "get_from_web"};

        return this.worker_req(obj);

    },
    get_one_from_web: function(key) {
        if (deployment.is_oworld) {
            return;
        }
        return new Promise(async (resolve, reject) => {
            let val = await webext.get_from_web([key]);
            if (val == null) {
                resolve(null);
                return;
            }
            resolve(val[sync.key(key)]);
        });
    },
    set_from_web: function(key, val) {
        if (deployment.is_oworld) {
            return;
        }
        var obj = {};
        obj[sync.key(key)] = val;

        return this.worker_req({obj: obj, code: "set_from_web"});
    },
    to_num: function(x) {
        // let n = parseFloat(x);
        // if (String(n) == x) {
        //     return n;
        // } else {
        //     return x;
        // }
        if (x == null) return null;
        if (x === false) return false;
        if (x === true) return true;

        let n = (+x);
        if (!isNaN(n)) {
            return n;
        } else {
            return x;
        }
    },
    clear_storage_data: async function() {
        if (deployment.is_oworld) {
            await fire("game_sync_erase", []);
            sync.oworld_data = {};
        } else if (deployment.is_chrome_ext == true) {
            chrome.storage.local.clear(function() {
                console.log("Erased data");
            });
        } else {
            await this.send_code("clear_storage_data", {});
            for (let i = localStorage.length -1; i >= 0; i--) {
                let key = localStorage.key(i);
                if (key.slice(0,2) == sync.prefix) {
                    localStorage.removeItem(key);
                }
            }
        }
    }

}

