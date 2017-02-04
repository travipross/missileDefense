function GameManager(){
    this.score = 0;
    this.bestScore = 0;
    
    this.addScore = function(amt){
        this.score+=amt;
        if(this.score > this.bestScore){
            this.bestScore = this.score;
            if(storage){
                localStorage.bestScore = this.bestScore;
            }
        }
    }
    
    this.subScore = function(amt){
        this.score-=amt;
        if(this.score < 0){
            this.score = 0;
        }
    }
    
    this.showScore = function(){
        textAlign(RIGHT);
        textSize(20);
        text("Score: " + this.score,width-20,20);
        text("Best: " + this.bestScore,width-20,40);
    }
}