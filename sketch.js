var cells = [];
var food = [];
var trees = [];

var minX = -1000;
var maxX = 1000;
var minY = -1000;
var maxY = 1000;

var camX = 1280+1000;
var camY = 720+1000;
var camSpeed = 5;

var minPop = 50;
var population = minPop;
var repoRate = 0.1;
var mutationRate = 0.1;
var mutationStrength = 0.1;
var foodEnergy = 5;
var energyLoss = 0.05;
var minimumEnergy = 100;
var startEnergy = 100;
var foodAmount = 2000;

var stat = -1;

function setup() {
  createCanvas(1280,720);
  for(i=0;i<foodAmount;i++){
    food.push(new Food(random(minX,width+maxX),random(minY,height+maxY),true));
  }
  for(t=0;t<250;t++){
    trees.push(new Tree(random(minX,width+maxX),random(minY,height+maxY)));
  }
  for(j=0;j<minPop;j++){
    cells.push(new Cell(null,null,null,null,null,null,null,random(minX,width+maxX),random(minY,height+maxY),100,0));
  }
}

function draw() {
  background(40,43,55);
  for(j=0;j<population;j++){
    var input = [cells[j].getEnergy(),cells[j].getTouch(),1];
    if(cells[j].mouseTouch()&&mouseIsPressed&&mouseButton==LEFT){
      stat = j;
      //console.log(stat);
    }
    cells[j].update(input);
  }
  for(i=0;i<food.length;i++){
    if(food[i].reusable){
      fill(0,255,0);
    } else {
      fill(255,0,0);
    }
    food[i].render();
  }
  while(population<minPop){
    population++;
    console.log("new!");
    cells.push(new Cell(null,null,null,null,null,null,null,random(minX,width+maxX),random(minY,height+maxY),100,0));
  }
  for(j=0;j<population;j++){
    cells[j].render();
    cells[j].renderText(j);
  }
  for(t=0;t<trees.length;t++){
    trees[t].render();
  }
  if (keyIsDown(LEFT_ARROW)) {
    camX += camSpeed;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    camX -= camSpeed;
  }

  if (keyIsDown(UP_ARROW)) {
    camY += camSpeed;
  }

  if (keyIsDown(DOWN_ARROW)) {
    camY -= camSpeed;
  }
  if(stat!=-1){
    if(cells[stat]!=null){
      fill(255);
      textSize(20);
      text("Energy: "+cells[stat].energy,10,height-10);
      text("Lifetime: "+cells[stat].Lifetime,10,height-30);
      text("Max Lifetime: "+cells[stat].dnaLifetime,10,height-50);
      text("Hidden Neurons: "+cells[stat].dnaHidden,10,height-70);
      text("Want for Child: "+cells[stat].child,10,height-90);
      text("Generation: "+cells[stat].gen,10,height-110);
      text("Speed: "+cells[stat].speed,10,height-130);
      text("Rotation: "+cells[stat].rotateAmnt,10,height-150);
    }
    if(cells[stat]!=null){
      if(cells[stat].energy<1||cells[stat].dnaLifetime-cells[stat].Lifetime==1){
        stat = -1;
      }
    }
  }
  fill(255);
  textSize(32);
  text("Population: " + population,10,32);
}

function makeDNA(size,min,max){
  var temp = [];
  for(y=0;y<size;y++){
    temp.push(random(min,max));
  }
  return temp;
}
