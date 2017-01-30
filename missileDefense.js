var meteorSpeed = 1;
var missileSpeed = 5;
var groundHeight = 50;
var launchers = [];
var missiles = [];
var meteors = [];
var gameOver = false;
var mgr;
var rLauncher = 35;

function setup(){
	createCanvas(800,600);
	createLaunchers(4);
	mgr = new GameManager();
}

function draw(){
	background(51);
	fill(0,255,100);
	noStroke();
	rect(0,height-groundHeight,width,groundHeight);
	
	mgr.showScore();
	
	if(countLaunchers()<1){
		textAlign(CENTER);
		textSize(50);
		fill(255,0,0);
		text("GAME OVER",width/2,height/2);
		textSize(25);
		text("Click to restart",width/2,height/2+25);
		gameOver = true;
	}else{
		
		for(var i=0; i<launchers.length; i++){
			launchers[i].update();
			launchers[i].show();
		}
		
		
		for (var i=missiles.length-1;i>=0;i--){
			missiles[i].update();
			if(missiles[i].exploded){
				missiles.splice(i,1);
			}else{
				missiles[i].show();
				if(missiles[i].hit){
					for(var j=meteors.length-1; j>=0; j--){
						if(meteorDestroyed(meteors[j],missiles[i])){
						    mgr.addScore(5);
							meteors.splice(j,1);
						}
					}
				}
			}
		}
		
		if(frameCount%100 == 0){
			meteors.push(new Meteor());
		}
		
		for(var i=meteors.length-1;i>=0;i--){
			meteors[i].update();
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

function getClosestLauncher(xTarget){
    var closest = -1;
    var xdist = width; // high
    for(var i=0;i<launchers.length;i++){
        if (abs(xTarget-launchers[i].xPos) <= xdist && !launchers[i].cooldown){
            xdist = abs(xTarget-launchers[i].xPos);
            closest = i;
        }
    }
    return closest;
}

function Launcher(xPos){
    this.xPos = xPos;
    this.r = 35;
	this.cooldown = false;
    this.cooldownTime = 200;
	this.cooldownStart = frameCount;
	this.destroyed = false;
	
	this.update = function(){
		if(!this.destroyed){
			if(frameCount >= this.cooldownStart+this.cooldownTime && this.cooldown){
				this.cooldown = false;
			}
		}
	}
	
    this.show = function(){
		if(!this.destroyed){
			if(this.cooldown){
				fill(0,100,255);
			}else{
				fill(200);
			}
			ellipse(xPos,height-groundHeight,this.r,this.r);
		}
    }
	
	this.startCooldown = function(){
		this.cooldown = true;
		this.cooldownStart = frameCount;
	}
}

function createLaunchers(n){
    for (var i=0;i<n;i++){
		var secWidth = width/(n*2);
        launchers[i] = new Launcher(secWidth*(2*i+1));
        launchers[i].show();
    }
}

function mousePressed(){
	if(gameOver){
		createLaunchers(4);
		meteors = [];
		missiles = [];
		gameOver = false;
		mgr.score = 0;
	}else{
		var target = createVector(mouseX,mouseY);
		var launcherNum = getClosestLauncher(mouseX);
		if(launcherNum>=0){
			missiles.push(new Missile(target,launcherNum));
			launchers[launcherNum].startCooldown(); 
		}
		mgr.subScore(1);
	}
	return false;
}

function meteorDestroyed(meteor,missile){
	this.meteor = meteor;
	this.missile= missile;
	if(this.missile.hit && p5.Vector.dist(this.missile.target,this.meteor.pos)<=this.missile.r/2+this.meteor.r/2){
		return true;
	}else{
		return false;
	}
}

function countLaunchers(){
	var n=0;
	for (var i =0; i<launchers.length;i++){
		if(!launchers[i].destroyed){
			n++;
		}
	}
	return n;
}
