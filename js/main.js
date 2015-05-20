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
		canvas.width = tempimage.width;
		canvas.height = tempimage.height;

		Game.context.drawImage(tempimage, 0,0);
	}
	tempimage.src = "img/cover2.png";
}

window.onload = function(){
	Game.launch();
	Game.draw();

}