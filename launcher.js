function Launcher(xPos){
    this.xPos = xPos;
    this.r = 35; // size
	this.cooldown = false; // cooldown state where unable to shoot
    this.cooldownTime = 200;
	this.cooldownStart = frameCount;
	this.destroyed = false;
	
	// check to see if cooldown time has elapsed
	this.update = function(){
		if(!this.destroyed){
			if(frameCount >= this.cooldownStart+this.cooldownTime && this.cooldown){
				this.cooldown = false;
			}
		}
	}
	
	// display launcher as circle
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
	
	// start cooldown timer
	this.startCooldown = function(){
		this.cooldown = true;
		this.cooldownStart = frameCount;
	}
}