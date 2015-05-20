// basic structure: objects for game, buildings
// wow that was reallllly basic

Building = function(called, baseprice, wps)
{
	this.called = called;
	this.baseprice = baseprice;
	this.wps = wps;
}



Game = {};
Game.launch = function(){
	Game.canvas = document.getElementById("canvas");
	Game.context = Game.canvas.getContext("2d");
}

Game.draw = function(){
	tempimage = new Image();
	tempimage.onload = function(){
		Game.context.drawImage(tempimage, 0,0,Game.canvas.width,Game.canvas.height);
	}
	tempimage.src = "img/cover.png";
	//tempimage.src = "https://mdn.mozillademos.org/files/5395/backdrop.png"
}

window.onload = function(){
	Game.launch();
	Game.draw();

}