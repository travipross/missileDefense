// global object arrays
var launchers = [];
var missiles = [];
var meteors = [];

// visual configuration
var groundHeight = 50;
var rLauncher = 35;

// global vars
var gameOver = false;
var mgr;
var storage;

// gameplay configuration
var meteorSpeed = 1;
var missileSpeed = 5;
var nLaunchers = 5;

// initialize
function setup(){
	createCanvas(1000,600);
	createLaunchers(nLaunchers);
	
	// init manager to handle score
	mgr = new GameManager();
	
	// storage is possible, enable high score saving
	if (typeof(Storage) !== "undefined") {
        storage = true;
		// if high score exists, load it
        if(localStorage.bestScore !== undefined){
            mgr.bestScore = localStorage.bestScore;
        }
    } else {
        storage = false;
    }
}

// main loop
function draw(){
	background(51);
	fill(0,255,100);
	noStroke();
	rect(0,height-groundHeight,width,groundHeight);
	
	// show score in corner
	mgr.showScore();
	
	// if all launchers are destroyed, display game over screen
	if(countLaunchers()<1){
		textAlign(CENTER);
		textSize(50);
		fill(255,0,0);
		text("GAME OVER",width/2,height/2);
		textSize(25);
		text("Click to restart",width/2,height/2+25);
		gameOver = true;
	}else{
		// update each launcher
		for(var i=0; i<launchers.length; i++){
			launchers[i].update();
			launchers[i].show();
		}
		// update the position of each missile
		for (var i=missiles.length-1;i>=0;i--){
			missiles[i].update();
			if(missiles[i].exploded){
				// if done exploding, remove from array
				missiles.splice(i,1);
			}else{
				// if not fully exploded, display
				missiles[i].show();
				
				// if hit, find out which meteor(s) was/were destroyed
				if(missiles[i].hit){
					// check each meteor
					for(var j=meteors.length-1; j>=0; j--){
						if(meteorDestroyed(meteors[j],missiles[i])){
							// award 5 points for a hit and remove meteor from array
						    mgr.addScore(5);
							meteors.splice(j,1);
						}
					}
				}
			}
		}
		
		// every 100 frames, introduce a new meteor
		if(frameCount%100 == 0){
			meteors.push(new Meteor());
		}
		
		// for every meteor, update position and determine if it struck a target
		for(var i=meteors.length-1;i>=0;i--){
			meteors[i].update();
			// if meteor is far enough from its target, display. Otherwise destroy launcher and remove meteor
			if(p5.Vector.dist(meteors[i].pos,meteors[i].target) > rLauncher/2 + meteors[i].r/2){
				meteors[i].show();
			}else{
				//console.log("removing launcher " + meteors[i].targetLauncher);
				launchers[meteors[i].targetLauncher].destroyed = true;
				launchers[meteors[i].targetLauncher].cooldown = true;
				meteors.splice(i,1);
			}
		}
	}
}

// determine which launcher to fire missile from
function getClosestLauncher(xTarget){
    var closest = -1; // number of closest available launcher (numbered left to right)
    var xdist = width; // highest value
	
	// iterate through and find the lowest distance between the click target and any remaining launcher
    for(var i=0;i<launchers.length;i++){
        if (abs(xTarget-launchers[i].xPos) <= xdist && !launchers[i].cooldown){
            xdist = abs(xTarget-launchers[i].xPos);
            closest = i;
        }
    }
    return closest;
}

// generate evenly spaced launchers
function createLaunchers(n){
    for (var i=0;i<n;i++){
		var secWidth = width/(n*2);
        launchers[i] = new Launcher(secWidth*(2*i+1));
        //launchers[i].show();
    }
}

// executes when clicking
function mousePressed(){
	// if on game over screen, click to start a new game
	if(gameOver){
		createLaunchers(nLaunchers);
		meteors = [];
		missiles = [];
		gameOver = false;
		mgr.score = 0;
	// try to fire a missile at the clicked location
	}else{
		var target = createVector(mouseX,mouseY);
		var launcherNum = getClosestLauncher(mouseX);
		// if launcher is available, create a missile object and start cooldown
		if(launcherNum>=0){
			missiles.push(new Missile(target,launcherNum));
			launchers[launcherNum].startCooldown(); 
		}
		// subtract 1 from score for firing a missile
		mgr.subScore(1);
	}
	return false; // to ignore default browser behaviour
}

// check to see if meteor was destroyed by a missile (proximity check)
function meteorDestroyed(meteor,missile){
	this.meteor = meteor;
	this.missile= missile;
	if(this.missile.hit && p5.Vector.dist(this.missile.target,this.meteor.pos)<=this.missile.r/2+this.meteor.r/2){
		return true;
	}else{
		return false;
	}
}

// count how many launchers remain that are not destroyed
function countLaunchers(){
	var n=0;
	for (var i =0; i<launchers.length;i++){
		if(!launchers[i].destroyed){
			n++;
		}
	}
	return n;
}
