/**
 * a HUD container and child items
 */
game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({
  init: function () {
    // call the constructor
    this._super(me.Container, 'init');

    // persistent across level change
    this.isPersistent = true;

    // make sure we use screen coordinates
    this.floating = true;

    // give a name
    this.name = "HUD";

    // add our child score object
    this.addChild(new game.HUD.ScoreItem(-10, -10));
	
	this.addChild(new game.HUD.HealthItem(600, 20));
	
	this.addChild(new game.HUD.DeathClock(-640, -470));
  }
});

/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend( {
  /**
   * constructor
   */
  init : function (x, y) {
    // call the parent constructor
    // (size does not matter here)
    this._super(me.Renderable, 'init', [x, y, 10, 10]);

    // create the font object
    this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));

    // font alignment to right, bottom
    this.font.textAlign = "right";
    this.font.textBaseline = "bottom";

    // local copy of the global score
    this.score = -1;
  },

  /**
   * update function
   */
  update : function (dt) {
    // we don't draw anything fancy here, so just
    // return true if the score has been updated
    if (this.score !== game.data.score) {
      this.score = game.data.score;
      return true;
    }
    return false;
  },

  /**
   * draw the score
   */
  draw : function (renderer) {
        // this.pos.x, this.pos.y are the relative position from the screen right bottom
		this.font.draw (renderer, game.data.score, me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y);
  }
})

//add health
game.HUD.HealthItem = me.Renderable.extend( {
  /**
   * constructor
   */
  init : function (x, y) {
    // call the parent constructor
    // (size does not matter here)
    this._super(me.Renderable, 'init', [x, y, 10, 10]);

    // create the font object
    /* this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));

    // font alignment to right, bottom
    this.font.textAlign = "right";
    this.font.textBaseline = "top"; */
	this.sprite = new me.Sprite(this.pos.x, this.pos.y, {
		image: "hearts",
			framewidth : 32,
			frameheight : 32,
			//anchorPoint : new me.Vector2d(0.5, 0.5)
	});
    // local copy of the global health
    this.health = -1;
  },

  /**
   * update function
   */
  update : function (dt) {
    // we don't draw anything fancy here, so just
    // return true if the health has been updated
     if (this.health !== game.data.health) {
      this.health = game.data.health;
      return true;
    }
    return false; 
	
  },

  /**
   * draw the score
   */
  draw : function (renderer) {
        // this.pos.x, this.pos.y are the relative position from the screen right bottom
		//this.font.draw (renderer, "Life:" + game.data.health, me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y);
		for (var i = 0; i < game.data.health; i++)
    	{
    		this.sprite.pos.x = (35*i) + 550;
    		this.sprite.draw(renderer, me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y);
    	}
  }
});

//add timer

game.HUD.DeathClock = me.Renderable.extend({
	init: function(x, y) {
		this._super(me.Renderable, 'init', [x, y, 10, 10]);
		this.remainingTime = 59;
		this.origRemainingTime = this.remainingTime;
		this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));
		this.font.textAlign = "Left";
		this.font.textBaseline = "top";
		this.clock = -1;
		this.tween = new me.Tween(this).to({
			remainingTime: 0,
		}, this.remainingTime * 1000).onComplete(() => {
			//throw "GG BRO";
				me.audio.play("die");
				me.state.change( me.state.GAMEOVER );
				
			});
			this.tween.isPersistent = true;
			this.tween.start();

	},

	draw: function(renderer) {


		var divisor_for_minutes = this.remainingTime % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);

		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.ceil(divisor_for_seconds);

		this.font.draw(renderer, "Time: " + minutes + ":" + ('00' + seconds).slice(-2), me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y);
		
	},
	onDestroyEvent : function () {
        //just in case
        this.tween.stop();
      }
});