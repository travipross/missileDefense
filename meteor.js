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
