(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var pixi = {};
pixi.Application = function() {
	this._lastTime = new Date();
	this._setDefaultValues();
};
pixi.Application.prototype = {
	_setDefaultValues: function() {
		this.pixelRatio = 1;
		this.skipFrame = false;
		this.set_stats(false);
		this.backgroundColor = 16777215;
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this._skipFrame = false;
	}
	,start: function() {
		var _this = window.document;
		this._canvas = _this.createElement("canvas");
		this._canvas.style.width = this.width + "px";
		this._canvas.style.height = this.height + "px";
		this._canvas.style.position = "absolute";
		window.document.body.appendChild(this._canvas);
		this._stage = new PIXI.Stage(this.backgroundColor);
		var renderingOptions = { };
		renderingOptions.view = this._canvas;
		renderingOptions.resolution = this.pixelRatio;
		this._renderer = PIXI.autoDetectRenderer(this.width,this.height,renderingOptions);
		window.document.body.appendChild(this._renderer.view);
		window.onresize = $bind(this,this._onWindowResize);
		window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
		this._lastTime = new Date();
	}
	,_onWindowResize: function(event) {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this._renderer.resize(this.width,this.height);
		this._canvas.style.width = this.width + "px";
		this._canvas.style.height = this.height + "px";
		if(this.onResize != null) this.onResize();
	}
	,_onRequestAnimationFrame: function() {
		if(this.skipFrame && this._skipFrame) this._skipFrame = false; else {
			this._skipFrame = true;
			this._calculateElapsedTime();
			if(this.onUpdate != null) this.onUpdate(this._elapsedTime);
			this._renderer.render(this._stage);
		}
		window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
		if(this._stats != null) this._stats.update();
	}
	,_calculateElapsedTime: function() {
		this._currentTime = new Date();
		this._elapsedTime = this._currentTime.getTime() - this._lastTime.getTime();
		this._lastTime = this._currentTime;
	}
	,set_stats: function(val) {
		if(val) {
			var _container = window.document.createElement("div");
			window.document.body.appendChild(_container);
			this._stats = new Stats();
			this._stats.domElement.style.position = "absolute";
			this._stats.domElement.style.top = "2px";
			this._stats.domElement.style.right = "2px";
			_container.appendChild(this._stats.domElement);
			this._stats.begin();
		}
		return this.stats = val;
	}
};
pixi.display = {};
pixi.display.DisplayObject = function() {
	PIXI.DisplayObject.call(this);
	this.name = "";
};
pixi.display.DisplayObject.__super__ = PIXI.DisplayObject;
pixi.display.DisplayObject.prototype = $extend(PIXI.DisplayObject.prototype,{
});
pixi.display.DisplayObjectContainer = function() {
	PIXI.DisplayObjectContainer.call(this);
};
pixi.display.DisplayObjectContainer.__super__ = PIXI.DisplayObjectContainer;
pixi.display.DisplayObjectContainer.prototype = $extend(PIXI.DisplayObjectContainer.prototype,{
});
pixi.renderers = {};
pixi.renderers.IRenderer = function() { };
var samples = {};
samples.pixidude = {};
samples.pixidude.Main = function() {
	pixi.Application.call(this);
	this._init();
	var assetsToLoader = ["assets/spine/data/Pixie.json","assets/spine/data/iP4_BGtile.jpg","assets/spine/data/iP4_ground.png"];
	this._loader = new PIXI.AssetLoader(assetsToLoader);
	this._loader.onComplete = $bind(this,this.onAssetsLoaded);
	this._loader.load();
	this._postition = 0;
};
samples.pixidude.Main.main = function() {
	new samples.pixidude.Main();
};
samples.pixidude.Main.__super__ = pixi.Application;
samples.pixidude.Main.prototype = $extend(pixi.Application.prototype,{
	_init: function() {
		this.set_stats(true);
		this.backgroundColor = 65280;
		this.resize = false;
		this.width = 800;
		this.height = 600;
		pixi.Application.prototype.start.call(this);
	}
	,onAssetsLoaded: function() {
		this._background1 = PIXI.Sprite.fromImage("assets/spine/data/iP4_BGtile.jpg");
		this._background2 = PIXI.Sprite.fromImage("assets/spine/data/iP4_BGtile.jpg");
		this._stage.addChild(this._background1);
		this._stage.addChild(this._background2);
		this._foreground1 = PIXI.Sprite.fromImage("assets/spine/data/iP4_ground.png");
		this._foreground2 = PIXI.Sprite.fromImage("assets/spine/data/iP4_ground.png");
		this._stage.addChild(this._foreground1);
		this._stage.addChild(this._foreground2);
		this._foreground1.position.y = this._foreground2.position.y = 640 - this._foreground2.height;
		this._pixie = new PIXI.Spine("assets/spine/data/Pixie.json");
		var scale = 0.3;
		this._pixie.position.x = 341.33333333333331;
		this._pixie.position.y = 500;
		this._pixie.scale.x = this._pixie.scale.y = scale;
		this._pixie.stateData.setMixByName("running","jump",0.2);
		this._pixie.stateData.setMixByName("jump","running",0.4);
		this._pixie.state.setAnimationByName(0,"running",true);
		this._stage.addChild(this._pixie);
		this._stage.click = $bind(this,this._stageOnClick);
	}
	,_stageOnClick: function(data) {
		this._pixie.state.setAnimationByName(0,"jump",false);
		this._pixie.state.addAnimationByName(0,"running",true,0);
	}
});
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
samples.pixidude.Main.main();
})();
