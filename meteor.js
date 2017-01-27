function Meteor(){
	var remaining = [];
	for(var i=0;i<launchers.length; i++){
		if (!launchers[i].destroyed){
			remaining.push(i)
		}
	}
	this.targetLauncher = remaining[floor(random(0,remaining.length))]; // determine which launcher to aim for
    this.target = createVector(launchers[this.targetLauncher].xPos,height-groundHeight); // get coords to target
	this.pos = createVector(random(-50,width+50),-50); // create initial position offscreen
	this.speed = p5.Vector.sub(this.target,this.pos).setMag(meteorSpeed); // incremental position change
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
