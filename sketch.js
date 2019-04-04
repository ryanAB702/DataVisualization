/*Base functions - setup runs once, draw is continuous*/
let table;
let countryList = [];
let beer;
let wine;
let spirits;
let other;
let totIntake;
let mgr;

//Fix scale for github
//Yellow background for beer maybe?
//Search for a country


//Load all images that will be used at some point in the sketch 
function preload(){
    table = loadTable("data/alcohol_consumption_data.csv", "header"); //header tells p5 that there is a header line in the csv
    beer = loadImage("images/beer.png");
    wine = loadImage("images/wine.png");
    spirits = loadImage("images/spirit6.png");
    other = loadImage("images/other_alc3.png");
    totIntake = loadImage("images/totIntake2.png");
}

//loadsData, sets image/ellipse/text modes to CENTER
function setup(){
    createCanvas(windowWidth, windowHeight);
    loadData();
    textAlign(CENTER, CENTER);
    textFont("Germania One");
    ellipseMode(CENTER);
    imageMode(CENTER);

    //Create SceneManager and add all 3 animations
    mgr = new SceneManager();
    mgr.addScene(Animation1);
    mgr.addScene(Animation2);
    mgr.addScene(Animation3);
    mgr.showNextScene();
}

//SceneManager functions, real work in Animation1, Animation2, Animation3
function draw(){
    mgr.draw();
}
function mousePressed(){
    mgr.mousePressed();
}

//Title Page Animation
function Animation1(){
    this.draw = function(){
        background(0);
        textSize(75);
        fill(255);
        text("Alcohol Consumption by Country", windowWidth/2, windowHeight/2 - 100);
        textSize(25);
        text("By: Ryan Bloom", windowWidth/2, windowHeight/2 + 50);
        textSize(20);
        text("(click the mouse to continue...)", windowWidth/2, windowHeight/2 + 300);
    }
    //Move to next animation when mouse is clicked
    this.mousePressed = function(){
        mgr.showNextScene();
    }
}

//Data set information animation
function Animation2(){
    this.draw = function(){
        background(0);
        textSize(75);
        fill(255);
        stroke(0);
        text("Each bubble represents a country...", windowWidth/2, windowHeight/2 - 150);
        textSize(50);
        text("Numbers represent liters of alcohol consumed per capita from 2010-2016...", windowWidth/2, windowHeight/2 + 75);
        text("Hover over the bubbles to learn more!", windowWidth/2, windowHeight/2 + 175);
        textSize(20);
        text("(click the mouse to visualize!)", windowWidth/2, windowHeight/2 + 300);
        strokeWeight(5);
        stroke(50, 150, 255);
        ellipse(windowWidth/2, windowHeight/2 - 35, 100, 100);
    }
    //Move to visualization when clicked
    this.mousePressed = function(){
        mgr.showNextScene();
    }
}

//Full visualization displayed here
function Animation3(){
    this.draw = function(){
        background(0);
        //Display each country object -- constantly check for hovering/viewing
        for(let i=0; i<countryList.length; i++){
            var temp1 = countryList[i];
            temp1.scaleStep();
            temp1.display();
            //When hovering -- bubble.viewing set to true --> display full details
            if(temp1.viewing){
                temp1.displayDeets();
            }
        }
    }
}

//Loads csv and parses all data creating each country object
function loadData(){
    var countriesSeen = new Set();
    var tempRanks = [];
    var prevCountry;
    //Loop through each row -- each country has multiple rows in data set (1 row per alcohol type)
    for(var i=0; i<table.getRowCount(); i++){
        var row = table.getRow(i);
        var country = row.get("Country");

        // Execute this if statement when new country row is reached 
        // At this point, tempRanks is filled with info about prevCountry
        // Create countryObj using that info from tempRanks and prevCountry while filling tempRanks agian with next Country info
        if(!(countriesSeen.has(country))){
            countriesSeen.add(country);
            if(tempRanks.length > 0){
                var tot = parseInt(tempRanks[0]);
                var beer = parseFloat(tempRanks[1]).toFixed(2);
                var wine = parseFloat(tempRanks[2]).toFixed(2);
                var spirit = parseFloat(tempRanks[3]).toFixed(2);
                var other = parseFloat(tempRanks[4]).toFixed(2);
                var tempX = random(50, windowWidth-50);
                var tempY = tot * (0.008*windowHeight);
                var newC = new countryObj(prevCountry, tot, beer, wine, spirit, other, tempX, tempY);
                // If random tempX overlaps with another countryObj -- re-select random until no overlaps
                
                
                while(checkOverlap(newC)){
                    var tx = random(50, windowWidth-50)
                    newC.x = tx;
                    newC.ogX = tx;
                }

                //Push countryObj to overall countryList to be displayed later
                countryList.push(newC);
            }
            tempRanks = [];
        }
        //reset sum to loop through 2010-2016 again -- filling tempRanks here
        var tempTot = 0;
        for(let j=2010; j<2017; j++){
            var yr = j.toString();
            tempTot += nanCheck(parseFloat(row.get(yr)));
        }
        tempRanks.push(tempTot);
        prevCountry = country;
    }
}

class countryObj{
    //coountryObj has rankings for each type of alcohol in dataset as well as x and y values
    constructor(tempName, tempTotal, tempBeer, tempWine, tempSpirit, tempOther, tempX, tempY){
        this.name = tempName;
        this.beerRank = tempBeer;
        this.wineRank = tempWine;
        this.spirtRank = tempSpirit;
        this.otherRank = tempOther;
        this.totalRank = tempTotal;
        this.x = tempX;
        this.y = tempY;
        //ogX and ogY used to reset bubble location after growing (some bubbles move when they grow to remain on screen)
        this.ogX = tempX;
        this.ogY = tempY;
        
        //Set ellipse size based on total rank (scale up the tiny ones so they can be seen)
        if(tempTotal < 20){
            this.size = tempTotal*2;
        }
        else{
            this.size = tempTotal * 0.85;
        }
        
        //vewing = true when hover by mouse; used to display details
        this.viewing = false;
    }

    display(){
        //Display the country bubble with color and size based on toatlRank
        strokeWeight(5);
        stroke(color(this.totalRank, this.totalRank*3, this.totalRank*10));
        fill(255);
        //Give some motion to the visualization
        /*
        if(!this.viewing){
            this.wiggle();
        }*/
        ellipse(this.x, this.y, this.size, this.size);
    }

    //Check if mouse is hovering over one of the bubbles -- called by scaleStep() below
    infoHover(){
        let d = dist(mouseX, mouseY, this.x, this.y);
        if(d < this.size/2){
            this.viewing = true;
            return true;
        }
        else{
            this.viewing = false;
            return false;
        }
    }

    //Calls infoHover to check if mouse is hovering -- increases size of bubble up to 900 radius
    scaleStep(){
        var step = 30;
        var size = this.size;
        //Only grow if hovering and not already grown (<900)
        if(this.infoHover() && size < 700){
            var dex = countryList.indexOf(this);
            //Need this splice/push so that hovering country always displays on top of all other bubbles
            countryList.splice(dex,1);
            countryList.push(this);
            size += step;
            this.size = size;
            //If hits edge, moves towards center so information remains on screen
            this.edgeCheck();
        }
        //Shrink back to original size if previously grown and no longer hovering 
        else if(!this.infoHover() && size > this.totalRank){
            size -= step;
            if(size < this.totalRank){
                size = this.totalRank;
            }
            this.size = size;
            //Return to ogX and ogY if moved due to edgeCheck() above
            this.fixLocation();
        }
    }

    //Keep all bubbles on screen while wiggling and while scaling up for hover/info
    edgeCheck(){
        if(this.x - this.size/2 < 0){
            this.x += 15;
        }
        if(this.x + this.size/2 > windowWidth){
            this.x -= 15;
        }
        if(this.y - this.size/2 < 0){
            this.y += 15;
        }
        if(this.y + this.size/2 > windowHeight){
            this.y -= 15;
        }
    }

    //Return bubbles to ogX and ogY if position changed to keep bubble on screen via edgeCheck()
    fixLocation(){
        if(this.x > this.ogX){
            this.x -= 15;
        }
        if(this.x < this.ogX){
            this.x += 15;
        }
        if(this.y > this.ogY){
            this.y -= 15;
        }
        if(this.y < this.ogY){
            this.y += 15;
        }
    }

    //Add wiggle to bubbles (keep from overlapping and from going off screen)
    wiggle(){
        var randX = random(-0.5,0.5);
        var randY = random(-0.2,0.2);
        this.x += randX;
        this.y += randY;
        if(checkOverlap(this)){
            this.x -= randX;
            this.y -= randY;
        }
        this.edgeCheck();
    }

    //Display images for alcohol types as well as data information upon hovering
    displayDeets(){
        //var ranks = [];
        textSize(this.size/15);
        textFont("Acme");
        strokeWeight(3);
        stroke(255);
        fill(0);
        //text(this.name, this.x, this.y-375);
        text(this.name, this.x, this.y-300);
        
        stroke(color(this.totalRank, this.totalRank*3, this.totalRank*10));
        line(this.x - this.size/2 + 138, this.y - 325,this.x + this.size/2 - 138, this.y - 325);
        
        textSize(this.size/20);
        textFont("Germania One");
        image(beer, this.x-300, this.y-250, this.size/9, this.size/9);
        line(this.x - this.size/2 + 40, this.y - 185,this.x + this.size/2 - 40, this.y - 185);
        text("Beer - " + this.beerRank, this.x, this.y-250)

        image(wine, this.x-375, this.y-100, this.size/10, this.size/7);
        line(this.x - this.size/2 + 2, this.y - 15,this.x + this.size/2 - 2, this.y - 15);
        text("Wine - " + this.wineRank, this.x, this.y-100);

        image(spirits, this.x-375, this.y+50, this.size/9, this.size/9);
        line(this.x - this.size/2 + 20, this.y + 117,this.x + this.size/2 - 20, this.y + 117);
        text("Spirits - " + this.spirtRank, this.x, this.y+50);

        image(other, this.x-325, this.y+200, this.size/10, this.size/7);
        line(this.x - this.size/2 + 90, this.y + 273,this.x + this.size/2 - 90, this.y + 273);
        text("Other - " + this.otherRank, this.x, this.y + 200);

        image(totIntake, this.x-200, this.y+340, this.size/6.5, this.size/6.5);
        text("Total - " + this.totalRank, this.x, this.y + 360);
    }
}

//Clean up data - if no value given (nan), set that to 0
function nanCheck(arg){
    arg = arg || 0;
    return arg;
}

//Used to ensure no bubbles overlap -- called in wiggle and in loadData()
function checkOverlap(arg1){
    for(let i=0; i<countryList.length; i++){
        let temp = countryList[i];
        if(temp != arg1){
            let d = dist(arg1.x, arg1.y, temp.x, temp.y);
            if(d - 10 < arg1.size/2 + temp.size/2){
                return true
            }
        }
    }
    return false;
}
