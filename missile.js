var meteorSpeed = 1;
var missileSpeed = 5;
var groundHeight = 50;
var launchers = [];
var missiles = [];
var meteors = [];
var gameOver = false;
function setup(){
	createCanvas(800,600);
	createLaunchers(4);
}

function draw(){
	background(51);
	fill(0,255,100);
	noStroke();
	rect(0,height-groundHeight,width,groundHeight);
	
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
			if(meteors[i].pos.y < height-groundHeight){
				meteors[i].show();
			}else{
				console.log("removing launcher " + meteors[i].targetLauncher);
				//launchers.splice(meteors[i].targetLauncher,1);
				launchers[meteors[i].targetLauncher].destroyed = true;
				launchers[meteors[i].targetLauncher].cooldown = true;
				meteors.splice(i,1);
			}
		}
	}
}

function Meteor(){
	var remaining = [];
	for(var i=0;i<launchers.length; i++){
		if (!launchers[i].destroyed){
			remaining.push(i)
		}
	}
	this.targetLauncher = remaining[floor(random(0,remaining.length))];
    this.target = createVector(launchers[this.targetLauncher].xPos,height-groundHeight);
	this.start = createVector(random(-50,width+50),-50);
	this.angle = p5.Vector.sub(this.target,this.start).heading();
	this.speed = p5.Vector.fromAngle(this.angle).mult(meteorSpeed);
    this.pos = this.start;
	this.r = 10;
	
    this.update = function(){
		if(this.pos.y < height-groundHeight){
			this.pos.add(this.speed);
		}
    }
    
    this.show = function(){
        stroke(255);
		fill(255);
		ellipse(this.pos.x,this.pos.y,this.r,this.r);
    }
}

function Missile(target,closestLauncher){
    this.target = target; // end target of missile
    this.start = createVector(launchers[closestLauncher].xPos,height-groundHeight); // location of missile launcher
    this.pos = 0; // current location of missile
    this.angle = p5.Vector.sub(this.target,this.start).heading(); // unit vector pointing from start to target
    this.dist = p5.Vector.sub(this.target,this.start).mag(); // total distance from launcher to target
    this.path = p5.Vector.fromAngle(this.angle).mult(this.pos);
	
	this.rMax = 75;
	this.r = 0;
	this.growthRate = 0.5;
	this.hit = false;
	this.exploded = false;
    
    this.update = function(){
		if(this.pos < this.dist){
			this.pos += missileSpeed;
			this.pos = constrain(this.pos,0,this.dist);
			this.path = p5.Vector.fromAngle(this.angle).mult(this.pos); 
		}else if(this.pos == this.dist){
			this.hit = true;
			if(this.r < this.rMax){
				this.r += this.growthRate;
			}else{
				this.exploded = true;
			}
		}
    }
    
    this.show = function(){
		if(this.pos <this.dist){
			push();	
			stroke(255);
			translate(this.start.x,this.start.y);
			line(0,0,this.path.x,this.path.y);
			pop();
		}else{
			push();
			stroke(255,100,100);
			fill(255,0,0,100);
			ellipse(this.target.x,this.target.y,this.r,this.r);
			pop();
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
	}else{
		var target = createVector(mouseX,mouseY);
		var launcherNum = getClosestLauncher(mouseX);
		if(launcherNum>=0){
			missiles.push(new Missile(target,launcherNum));
			launchers[launcherNum].startCooldown(); 
		}
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