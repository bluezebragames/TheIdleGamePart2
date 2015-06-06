// beautify a number
var fix = function(num)
{
    // first of all, is it > 1,000,000?

    if(num > 1000000)
    {
        var numdigits = Math.floor(Math.log(num) / Math.log(10));
        var numgroupsofthree = numdigits / 3;
        numdigits -= numgroupsofthree;
        switch (numgroupsofthree)
        {
        case 2:
            var postfix = "Million";
            break;
        case 3:
            var postfix = "Billion";
            break;
        case 4:
            var postfix = "Trillion";
            break;
        case 5:
            var postfix = "Quadrillion";
            break;
        case 6:
            var postfix = "Quintillion";
            break;
        default:
            var postfix = "...  A lot";
        }
        return (num / Math.pow(10, numdigits)) + " " + postfix;
    }

    return Math.round(num);
}



var Building = function(bprice,wpsgain,howmany,called){
    this.bprice=bprice;
    this.price=bprice;
    this.wpsgain=wpsgain;
    this.howMany=howmany;
    this.called=called;

    /*this.tooltip = function(){
        return '<div>Name: ' + this.called + ' </div>' + '<div>Amount: ' + this.howMany + '</div'
        + '<div>Price: ' + this.price + '</div>';
    }*/
}


Game = {};

/*Game.tooltip = function(html){
    div = document.getElementById("tooltip");
    this.html = html;
    div.innerHTML = this.html;
}
Game.tooltip.get = function(html){
    
}
Game.tooltip.hide = function(){

}*/

// resets things and loads the save from localstorage
Game.Launch = function() {
    Game.wps = 0;
    Game.words = 0;
    Game.wordsd = 0;
    Game.wordsAllTime = 0;
    Game.priceScale = 1.15;
    Game.fps = 60;
    Game.buildings = [];
    Game.buildings.push(new Building(10,0.1));
    Game.buildings.push(new Building(10000,500));

    //Game.tooltip(Game.buildings[0].tooltip());
    if (localStorage.getItem("game"))
    {
        Game.loadSave(localStorage.getItem("game"));
    }

    if(!Game.playerName){Game.newName();}
    document.getElementById("greeting").innerHTML = "Hello " + Game.playerName + "!";
    
}

// import the save file as text
Game.importSave = function() {
    var sve = prompt("Paste save here!");
    Game.loadSave(sve);
}

// the onclick function for the name
Game.newName = function() {
    Game.playerName = prompt("What's your name?");
    document.getElementById("greeting").innerHTML = "Hello " + Game.playerName + "!";

}

// save the game, maybe?
Game.Save = function() {
    str = '';
    str += Game.wordsd + '|';
    for(b in Game.buildings)
    {
        str += Game.buildings[b].howMany + ',';
    }
    str += '|';
    str += Game.playerName;
    str += '|';
    localStorage.setItem("game", str);
    var middle = document.getElementById("middlepanel");
    middle.innerHTML = "Game Saved";

    setTimeout(Game.Save, 10000);
    setTimeout(Game.clearMiddle, 1500);
}

// load the save, maybe?
Game.loadSave = function(file) {
    splitfile = file.split('|');
    Game.words = parseInt(splitfile[0]);
    buildingCount = splitfile[1].split(',');
    for(var i = 0; i<Game.buildings.length; ++i)
    {
        Game.buildings[i].howMany = buildingCount[i];
    }
    Game.playerName = splitfile[2].toString();
    Game.recalculate();
}

// reset the game!
Game.reset = function(var kind)
{
    if(kind)
    {
        Game.loadSave("0|0,0,||");
    }
}

// add things when you click!
Game.click = function() {
    Game.words++;
    Game.wordsAllTime++;
}

Game.recalculate = function(){
    Game.recalculatePrice();
    Game.recalculateWps();
    Game.checkBuildings();
}

// have any buildings become affordable?
// have any buildings become expensive?
Game.checkBuildings = function(){
    for(b in Game.buildings)
    {
        if(Game.words <= Game.buildings[b].price)
        {
            var temp = document.getElementById("button"+b);
            temp.className = "grayed";
        }
        else if(Game.words > Game.buildings[b].price)
        {
            var temp = document.getElementById("button"+b);
            temp.className = "notgrayed";
        }
    }
}

// when you buy a building, cost increases
Game.recalculatePrice = function() {
    for(b in Game.buildings)
    {
        Game.buildings[b].price = Game.buildings[b].bprice * Math.pow(Game.priceScale, Game.buildings[b].howMany);
    }
}

// how about this recalculates the wps
Game.recalculateWps = function() {
    Game.wps = 0;
    for(b in Game.buildings)
    {
        Game.wps += Game.buildings[b].wpsgain * Game.buildings[b].howMany;
    }
}

// buys the building when you can afford it and you click it
Game.buyBuildings = function(whichBuilding) {
    if(Game.words>=Game.buildings[whichBuilding].price)
    {
        Game.words -= Game.buildings[whichBuilding].price;
        Game.buildings[whichBuilding].howMany++;
        Game.recalculate();
    }
}

// get words from idling
Game.Logic = function() {
    Game.words += Game.wps/Game.fps;
    Game.wordsd = Math.round(Game.words);
    Game.recalculate();
}

// draw everything!  mostly a wrapper function
Game.Draw = function() {
    Game.drawPic();
    Game.drawBuildings();
}

// draw the lone image
Game.drawPic = function() {
    Game.leftCanvas = document.getElementById("leftCanvas").getContext('2d');
    var img = new Image();
    img.onload = function()
    {
        Game.leftCanvas.drawImage(img,0,0);
    }
    img.src = "img/cover.png";
    img.width = leftCanvas.width;
    img.height = leftCanvas.height;
}

// how about it draws the functions
Game.drawBuildings = function() {
    for(b in Game.buildings)
    {
        var spn = document.getElementById("b" + b);
        spn.innerHTML = " Price: " + fix(Game.buildings[b].price) + " words";
    }
}

// everything that happens every frame
Game.Loop = function () {
    var meh = document.getElementById("words");
	meh.innerHTML = Game.wordsd + " words";
    var wps = document.getElementById("wordsps");
    wps.innerHTML = fix(10*Game.wps)/10.0 + " words per second";
    for(b in Game.buildings)
    {
        var currDiv = document.getElementById(b+"stats");
        var temp = Math.round(b)+1;
        currDiv.innerHTML = "You have " + Game.buildings[b].howMany + " of building " + temp;
    }

    Game.catchuplogic = 0;
    Game.Logic();
    Game.Draw();

    setTimeout(Game.Loop, 1000/Game.fps);
}

// clear the middle because it was overwritten by "game saved"
Game.clearMiddle = function() {
    var middle = document.getElementById("middlepanel");
    middle.innerHTML = "Middle";
}

window.onload = function() {
    Game.Launch();
    Game.Loop();
    Game.Save();
    document.getElementById("leftCanvas").addEventListener("click", Game.click, false);
    for(var i = 0; i < Game.buildings.length; i++)
    {
        document.getElementById(i).addEventListener("click", function(i){return function(){Game.buyBuildings(i)};}(i), false);
    }
}
