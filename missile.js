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
