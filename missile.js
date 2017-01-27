function Missile(target,closestLauncher){
    this.target = target; // end target of missile
    this.start = createVector(launchers[closestLauncher].xPos,height-groundHeight); // location of missile launcher
    this.pos = this.start.copy(); // current location of missile
    this.dist = p5.Vector.sub(this.target,this.start).mag(); // total distance from launcher to target
	this.speed = p5.Vector.sub(this.target,this.start).setMag(missileSpeed); // incremental position change
	
	this.rMax = 75; // maximum size of explosion
	this.r = 0;
	this.growthRate = 0.5;
	this.hit = false;
	this.exploded = false;
    
    this.update = function(){
		if(p5.Vector.dist(this.pos,this.target) >= this.speed.mag()){
			this.pos.add(this.speed);
		}else if(p5.Vector.dist(this.pos,this.target) < this.speed.mag()){
			this.pos = this.target;
			this.hit = true;
			if(this.r < this.rMax){
				this.r += this.growthRate;
			}else{
				this.exploded = true;
			}
		}
    }
    
    this.show = function(){
		if(p5.Vector.dist(this.target,this.pos) > 0){
			stroke(255);
			line(this.start.x,this.start.y,this.pos.x,this.pos.y);
		}else{
			stroke(255,100,100);
			fill(255,0,0,100);
			ellipse(this.target.x,this.target.y,this.r,this.r);
		}
    }
}