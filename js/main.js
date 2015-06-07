/*
    Helper functions!
    I never really understood the distinction between helper functions and regular
    functions...  All functions are supposed to be helpful (right?)
*/

// beautify a number
var fix = function(num)
{
    // first of all, is it >= 1,000,000?

    if(num >= 1000000)
    {
        var numdigits = Math.floor(Math.log(num) / Math.log(10) + .0001);
        var numgroupsofthree = Math.floor(numdigits / 3);
        numdigits -= numdigits % 3;
        switch (numgroupsofthree)
        {
        case 2:
            var postfix = "million";
            break;
        case 3:
            var postfix = "billion";
            break;
        case 4:
            var postfix = "trillion";
            break;
        case 5:
            var postfix = "quadrillion";
            break;
        case 6:
            var postfix = "quintillion";
            break;
        default:
            var postfix = "...  A lot";
        }
        return Math.floor((1000 * num / Math.pow(10, numdigits)) + .001) / 1000 + " " + postfix;
    }

    return Math.floor(num + .001);
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

/*
    SETUP STUPH!  But then again it's almost all setup stuph
*/

// resets things and loads the save from localstorage
Game.Launch = function() {
    Game.wps = 0;
    Game.words = 0;
    Game.wordsd = 0;
    Game.wordsAllTime = 0;
    Game.priceScale = 1.15;
    Game.fps = 60;
    Game.buildings = [];
    Game.buildings.push(new Building(15,0.1,0,"B1"));
    Game.buildings.push(new Building(100,1,0,"B2"));
    Game.buildings.push(new Building(10000,500,0,"B3"));
    Game.buildBuildings();

    //Game.tooltip(Game.buildings[0].tooltip());
    if (localStorage.getItem("game"))
    {
        Game.loadSave(localStorage.getItem("game"));
    }

    if(!Game.playerName){Game.newName();}
    document.getElementById("greeting").innerHTML = "Hello " + Game.playerName + "!";
    
}

// creates divs and buttons for buildings
Game.buildBuildings = function() {
    for(b in Game.buildings)
    {
        // create stat div on left panel
        var div = document.createElement("div");
        div.id = b + "stats";
        var leftpanel = document.getElementById("leftpanel");
        leftpanel.appendChild(div);

        // create buttons on right panel
        div = document.createElement("div");
        var b1 = b + 1;
        div.innerHTML = '<button id="button'+b+'">Buy one <span id="bname'+b+'">"Building '+b1+'"</span></button><span id="b'+b+'"></span>'
        div.id = b;
        var rightpanel = document.getElementById("rightpanel");
        rightpanel.appendChild(div);
    }
}

/*
    SAVING (and for some reason, renaming your character...  whoops)
*/

// import the save file as text
Game.importSave = function() {
    var sve = prompt("Paste save here!");
    Game.loadSave(sve);
}

// export the save file as text
Game.exportSave = function() {
    prompt("Copy and paste this save!", Game.Save());
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

    return str;

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

/*
    PRESTIGE!
*/

// reset the game!
Game.reset = function(kind)
{
    if(kind)
    {
        Game.loadSave("0|0,0,0,||");
    }
}

/*
    GAME LOGIC!
*/

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
// have any buildings become too expensive?
Game.checkBuildings = function(){
    for(b in Game.buildings)
    {
        if(Game.words < Game.buildings[b].price)
        {
            var temp = document.getElementById("button"+b);
            temp.className = "grayed";
        }
        else if(Game.words >= Game.buildings[b].price)
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
    Game.wordsd = fix(Game.words);
    Game.recalculate();
}

/*
    DRAWING!
*/

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
        // inside the button
        var spn = document.getElementById("bname" + b);
        spn.innerHTML = Game.buildings[b].called;

        // outside the button
        var spn = document.getElementById("b" + b);
        spn.innerHTML = " Price: " + fix(Game.buildings[b].price) + " words";
    }
}

// clear the middle because it was overwritten by "game saved"
Game.clearMiddle = function() {
    var middle = document.getElementById("middlepanel");
    middle.innerHTML = "Middle";
    //alert("ao8ueroi");
}

/*
    Let's do this thing!
*/

// everything that happens every frame
Game.Loop = function () {
    var meh = document.getElementById("words");
	meh.innerHTML = Game.wordsd + " words";
    var wps = document.getElementById("wordsps");
    wps.innerHTML = fix(10*Game.wps)/10.0 + " words per second";
    for(b in Game.buildings)
    {
        var currDiv = document.getElementById(b+"stats");
        currDiv.innerHTML = "You have " + Game.buildings[b].howMany + " " + Game.buildings[b].called + (Game.buildings[b].howMany == 1 ? "" : "s");
    }

    Game.catchuplogic = 0;
    Game.Logic();
    Game.Draw();

    setTimeout(Game.Loop, 1000/Game.fps);
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
