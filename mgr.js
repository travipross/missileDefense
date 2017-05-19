// handles scoring of game
function GameManager(){
    this.score = 0;
    this.bestScore = 0;
    
	// increment score and update bestScore if necessary
    this.addScore = function(amt){
        this.score+=amt;
        if(this.score > this.bestScore){
            this.bestScore = this.score;
            if(storage){
                localStorage.bestScore = this.bestScore;
            }
        }
    }
    
	// decrement score (for when firing)
    this.subScore = function(amt){
        this.score-=amt;
        if(this.score < 0){
            this.score = 0;
        }
    }
    
	// display the score on the top rigth of the screen
    this.showScore = function(){
        textAlign(RIGHT);
        textSize(20);
        text("Score: " + this.score,width-20,20);
        text("Best: " + this.bestScore,width-20,40);
    }
}