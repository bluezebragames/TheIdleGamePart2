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
    Game.wantTutorial = confirm("Do you want tutorials?");
    Game.tutorialLevel = 0;

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
    var hr = document.createElement("hr");
    rightpanel.appendChild(hr);
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
    str += Game.playerName + '|';
    str += parseInt(Game.tutorialLevel - Game.tutorialLevel % 2); // because you need it to be even
    str += '|';
    str += parseInt(Game.wordsAllTime) + '|';
    localStorage.setItem("game", str);
    var save = document.getElementById("save");
    save.innerHTML += "Game Saved";

    setTimeout(Game.Save, 10000);
    setTimeout(Game.clearMiddle, 1500);

    return str;
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
    Game.tutorialLevel = parseInt(splitfile[3]);
    Game.wordsAllTime = parseInt(splitfile[4]);
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
        Game.loadSave("0|0,0,0,|0|0|");
        Game.wordsAllTime = 0;
    }
}

/*
    GAME TUTORIAL!
*/

Game.checkTutorial = function() {
    if(Game.wantTutorial)
    {
        // do tutorial stuff, I'd say
        Game.middiv = document.getElementById("middiv");
        Game.middiv2 = document.getElementById("middiv2");
        switch(Game.tutorialLevel)
        {
        case 0:
            if(Game.wordsAllTime == 0)
            {
                // first tutorial!  get psyched!
                Game.tutorialText = "Ptro: Hey kid!<br>";
                Game.displaySlowText();
                Game.tutorialLevel++;
            }
            break;
        case 2:
            Game.tutorialText = "Ptro: I'm The Ptrocanfer, but you may call me The Ptrocanfer for short.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 4:
            Game.tutorialText = "Ptro: I see you're playing this game, and while I must commend you for it,<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 6:
            Game.tutorialText = "Ptro: I really was wondering if you had anything more important to do with your life.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 8:
            Game.tutorialText = "Ptro: Anyway, to start this game off you'd probably be best clicking on that white space off to the left a few times.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 10:
            Game.tutorialText = "Ptro: Maybe...  15.  How's 15 sound?<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 12:
            if(Game.wordsAllTime >= 15)
            {
                Game.tutorialText = "Ptro: Wow!  You actually did it!<br>";
                setTimeout(Game.displaySlowText, 5000);
                Game.tutorialLevel++;
            }
            break;
        case 14:
            Game.tutorialText = "Ptro: I really didn't think you were cabable of that.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 16:
            Game.tutorialText = "Ptro: Oh, who am I kidding.  I knew you could do it.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 18:
            Game.tutorialText = "Ptro: Anyway, that randomly chosen number 15 allows you to buy a 'B1.'<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 20:
            Game.tutorialText = "Ptro: Head off to the right panel over there and pick one up.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 22:
            if(Game.buildings[0].howMany >= 1)
            {
                Game.tutorialText = "Ptro: You see, now your 'words per second,' back on the left panel, is positive.<br>";
                setTimeout(Game.displaySlowText, 5000);
                Game.tutorialLevel++;
            }
            break;
        case 24:
            Game.tutorialText = "Ptro: This particular positive thing is good because it gives you words over time.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 26:
            Game.tutorialText = "Ptro: Weirdly enough, if you switch to another tab, you'll still get words, but more slowly.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 28:
            Game.tutorialText = "Ptro: So increasing your wps (acronyms ftw b/c I'm a maverick) is pretty nice.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 30:
            Game.tutorialText = "Ptro: Get to 17 words and buy another 'B1.'<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 32:
            if(Game.buildings[0].howMany >= 2)
            {
                Game.tutorialText = "Ptro: Cool beans!  It's almost as if those beans were significantly colder than usual.<br>";
                setTimeout(Game.displaySlowText, 5000);
                Game.tutorialLevel++;
            }
            break;
        case 34:
            Game.tutorialText = "Ptro: I'm really feeling the number five today.  How about five 'B1's.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 36:
            if(Game.buildings[0].howMany >= 5)
            {
                Game.tutorialText = "Ptro: Actually no, make that 6 'B1's.<br>";
                setTimeout(Game.displaySlowText, 5000);
                Game.tutorialLevel++;
            }
            break;
        case 38:
            if(Game.buildings[0].howMany >= 6)
            {
                Game.tutorialText = "Ptro: Congrats kid!  Maybe now it's time to try getting a 'B2.'<br>";
                setTimeout(Game.displaySlowText, 5000);
                Game.tutorialLevel++;
            }
            break;
        case 40:
            Game.tutorialText = "Ptro: Get 100 words and you can afford one.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 42:
            if(Game.buildings[1].howMany >= 1)
            {
                Game.tutorialText = "Ptro: Watch out, we've got a pro on our hands...<br>";
                setTimeout(Game.displaySlowText, 5000);
                Game.tutorialLevel++;
            }
            break;
        case 44:
            Game.tutorialText = "Ptro: Or should I say Ptro!<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        case 46:
            Game.tutorialText = "Ptro: Just kidding, but close enough.<br>";
            setTimeout(Game.displaySlowText, 5000);
            Game.tutorialLevel++;
            break;
        default:
            break;
        }
    }
}

Game.displaySlowText = function()
{
    Game.middiv.innerHTML = Game.middiv2.innerHTML;
    Game.middiv2.innerHTML = Game.tutorialText;
    Game.tutorialLevel++;
}

/*
    UPGRADES!
//

Game.checkUpgrades = function() {
    var upgradelist = [100,10,5];
    for(u in upgradelist)
    {
        for(b in Game.buildings)
        {
            if(Game.buildings[b].howMany >= upgradelist[u])
            {
                Game.unlockUpgrade(3*b+u);
            }
        }
    }
}

Game.unlockUpgrade = function() {

}*/

/*
    GAME LOGIC!
*/

Game.checkEverything = function() {
    Game.checkBuildings();
    Game.checkTutorial(); // WORKING ON RIGHT NOW!
    //Game.checkUpgrades(); // DON'T EVEN TRY THIS
    //Game.checkAchievements(); // NOT DONE
}

// add things when you click!
Game.click = function() {
    Game.words++;
    Game.wordsAllTime++;
}

Game.recalculate = function(){
    Game.recalculatePrice();
    Game.recalculateWps();
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
    Game.wordsAllTime += Game.wps/Game.fps;
    Game.wordsd = fix(Game.words);
    Game.recalculate();
    document.title = Game.wordsd;
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

// remove the "game saved" from the middle panel
Game.clearMiddle = function() {
    var save = document.getElementById("save");
    save.innerHTML = "";
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
    Game.checkEverything();


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
