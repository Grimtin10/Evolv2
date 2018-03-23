function Tree(x,y){
  this.pos = createVector(x,y);

  this.render = function(){
    push();
    translate(camX-this.pos.x,camY-this.pos.y);
    fill(0,200,0);
    ellipse(0,0,50,50);
    pop();
  }
}
