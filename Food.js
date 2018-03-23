function Food(x,y,reusable){
  this.pos = createVector(x,y);
  this.reusable = reusable;

  this.render = function(){
    push();
    translate(camX-this.pos.x,camY-this.pos.y);
    ellipse(0,0,10,10);
    pop();
  }

  this.randomize = function(){
    this.pos = createVector(random(minX,width+maxX),random(minY,height+maxY));
  }
}
