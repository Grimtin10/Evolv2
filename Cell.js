function Cell(dnaIn,dnaOut,dnaLifetime,dnaGreen,dnaHidden,dnaRad,dnaEnergy,x,y,startEnergy,gen){
  this.pos = createVector(x,y);
  this.rotation = 0;
  this.touchRotation = 0;
  this.Lifetime = 0;
  this.gen = gen;

  this.energy = startEnergy;
  this.touch = 0;
  this.speed = 0;
  this.rotateAmnt = 0;

  this.dnaIn = [];
  this.dnaOut = [];
  this.dnaLifetime = 0;
  this.dnaGreen = 0;
  this.dnaHidden = 0;
  this.dnaRad = 25;
  this.dnaEnergy = 0;

  if(dnaIn!=null){
    this.dnaIn = dnaIn;
  } else {
    this.dnaIn = makeDNA(2*3,-1,1);
  }
  if(dnaOut!=null){
    this.dnaOut = dnaOut;
  } else {
    this.dnaOut = makeDNA(3*2,-1,1);
  }
  if(dnaLifetime!=null){
    this.dnaLifetime = dnaLifetime;
  } else {
    this.dnaLifetime = round(random(1000,25000));
  }
  if(dnaGreen!=null){
    this.dnaGreen = dnaGreen;
  } else {
    this.dnaGreen = round(random(0,255));
  }
  if(dnaHidden!=null){
    this.dnaHidden = dnaHidden;
  } else {
    this.dnaHidden = round(random(3,8));
  }
  if(dnaRad!=null){
    this.dnaRad = dnaRad;
  } else {
    this.dnaRad = round(random(10,30));
  }
  if(dnaEnergy!=null){
    this.dnaEnergy = dnaEnergy;
  } else {
    this.dnaEnergy = round(random(50,100));
  }
  if(this.dnaIn.length<3*this.dnaHidden){
    for(d=0;d<this.dnaIn.length-3*this.dnaHidden;d++){
      this.dnaIn.push(random(-1,1));
    }
  }
  if(this.dnaOut.length<this.dnaHidden*3){
    for(d=0;d<this.dnaIn.length-this.dnaHidden*3;d++){
      this.dnaIn.push(random(-1,1));
    }
  }

  //console.log(this.dnaIn,this.dnaOut,this.dnaLifetime,this.dnaGreen);

  this.sigmoid = function(x){
    return 2/(1+pow(Math.E,(-2*x)))-1
    //1 / (1 + pow(Math.E, -x));
  }

  this.update = function(inputs){
    if(this.energy>=0&&this.Lifetime<=this.dnaLifetime){
      this.outputs = this.calcNN(this.dnaIn,this.dnaOut,this.dnaHidden,inputs,3);
      this.speed = Math.abs(this.outputs[0]*10)/(this.dnaRad/10);
      this.rotateAmnt = this.outputs[1]*4;
      this.child = abs(this.outputs[2]);
      this.rotation += this.rotateAmnt;
      if(this.rotation>360){
        this.rotation = 0;
      }
      if(this.rotation<0){
        this.rotation = 360;
      }
      for(c=0;c<trees.length;c++){
        if(pow((trees[c].pos.x-this.pos.x),2)+pow(((trees[c].pos.y-this.pos.y)),2)<=pow((50),2)){
          this.touch = 1; this.speed = 0.5;}
      }
      for(a=cells.length-1;a>=0;a--){
        if(a!=j&&pow((cells[a].pos.x-this.pos.x),2)+pow(((cells[a].pos.y-this.pos.y)),2)<=pow((this.dnaRad),2)){
          this.touch = 1; this.speed = 0.5;}
      }
      this.pos.x += this.speed * Math.cos(this.rotation * Math.PI / 180);
      this.pos.y += this.speed * Math.sin(this.rotation * Math.PI / 180);
      this.energy -= energyLoss;//+(this.speed/50);
      this.touch = (this.pos.x<(this.dnaRad/2)-minX||this.pos.x>(width-this.dnaRad/2)-maxX||this.pos.y<(this.dnaRad/2)+minY||this.pos.y>(height-this.dnaRad/2)+maxY)?this.speed:0;
      this.pos.x = (this.pos.x+(this.dnaRad/2)<minX)?minX:((this.pos.x)-(this.dnaRad/2)>width+maxX)?width+maxX:this.pos.x;
      this.pos.y = (this.pos.y+(this.dnaRad/2)<minY)?minY:((this.pos.y)-(this.dnaRad/2)>height+maxY)?height+maxY:this.pos.y;
      for(i=0;i<food.length;i++){
        if(pow((food[i].pos.x-this.pos.x),2)+pow(((food[i].pos.y-this.pos.y)),2)<=pow((this.dnaRad+10),2)){
          //console.log("nom!");
          if(food[i].reusable){
            food[i].randomize();
          } else {
            food[i] = food[food.length-1];
            food.pop();
          }
          this.energy += foodEnergy;
        }
      }
      if(this.Lifetime%1000==0){
        console.log("Lifetime: ",this.Lifetime,"Life left",this.dnaLifetime-this.Lifetime);
      }
      if(this.child>=0.75&&this.energy>=this.dnaEnergy+25){
        console.log("yes");
        this.energy-=this.dnaEnergy;
        this.tempIn = [];
        this.tempOut = [];
        this.tempLifetime = 0;
        this.tempGreen = 0;
        this.tempHidden = this.dnaHidden;
        this.tempRad = 0;
        this.tempEnergy = 0;
        for(x=0;x<this.dnaIn.length;x++){
          if(random(0,100)==100-mutationRate){
            this.tempIn.push(this.dnaIn[x]+random(-mutationStrength,mutationStrength));
          } else {
            this.tempIn.push(this.dnaIn[x]);
          }
        }
        for(x=0;x<this.dnaOut.length;x++){
          if(random(0,100)==100-mutationRate){
            this.tempOut.push(this.dnaOut[x]+random(-mutationStrength,mutationStrength));
          } else {
            this.tempOut.push(this.dnaOut[x]);
          }
        }
        if(random(0,100)==100-mutationRate){
          this.tempLifetime = this.dnaLifetime+random(-mutationStrength,mutationStrength);
        } else {
          this.tempLifetime = this.dnaLifetime;
        }
        if(random(0,100)==100-mutationRate){
          this.tempGreen = this.dnaGreen+random(-mutationStrength,mutationStrength);
        } else {
          this.tempGreen = this.dnaGreen;
        }
        if(random(0,100)==100-mutationRate&&this.dnaHidden>2){
          this.tempHidden = this.tempHidden+random(-1,1);
        } else {
          this.tempHidden = this.tempHidden;
        }
        if(random(0,100)==100-mutationRate){
          this.tempRad = this.dnaRad+random(-2,2);
        } else {
          this.tempRad = this.dnaRad;
        }
        if(random(0,100)==100-mutationRate){
          this.tempEnergy = this.tempEnergy+random(-2,2);
        } else {
          this.tempEnergy = this.dnaEnergy;
        }
        cells.push(new Cell(this.tempIn,this.tempOut,this.tempLifetime,this.tempGreen,this.tempHidden,this.tempRad,this.tempEnergy,this.pos.x,this.pos.y,this.dnaEnergy,this.gen+1));
        population++;
        console.log(cells[cells.length-1],this.tempEnergy,this.dnaEnergy,this.energy,j,cells.length-1);
      }
      this.Lifetime++;
    } else {
      population-=1;
      food.push(new Food(this.pos.x,this.pos.y,false));
      cells[j] = cells[cells.length-1];
      cells.pop();
    }
  }

  this.getEnergy = function(){
    return this.energy/100;
  }

  this.getTouch = function(){
    return this.touch;
  }

  this.mouseTouch = function(){
    return (dist(camX-mouseX,camY-mouseY,this.pos.x,this.pos.y)<=this.dnaRad)
  }

  this.render = function(){
    push();
    angleMode(DEGREES);
    translate(camX-this.pos.x,camY-this.pos.y);
    rotate(this.rotation);
    if(stat==j){
      strokeWeight(2.5);
      stroke(255);
    } else {
      stroke(0);
      strokeWeight(1);
    }
    fill(map(this.speed,-5,5,0,255,true),this.dnaGreen,map(this.rotateAmnt,-2,2,0,255,true),map(this.getEnergy()*100,0,100,0,255,true));
    ellipse(0,0,this.dnaRad,this.dnaRad);
    fill(255);
    stroke(0);
    strokeWeight(2.5);
    line(0,0,(-this.dnaRad/2),0);
    //console.log(this.pos.x,this.pos.y);
    pop();
  }

  this.renderText = function(index){
    textSize(20);
    fill(255);
    text(index,camX-this.pos.x-10,camY-(this.pos.y+this.dnaRad+5));
  }

  this.calcNN = function(ih,ho,amount,inputs,output){
    this.hidden = [];
    //console.log(amount);
    for(g=0;g<amount;g++){
      this.hidden.push(0);
    }
    for(b=0;b<amount;b+=1){
      for(a=0;a<ih.length/amount;a+=2){
        this.hidden[b] = this.sigmoid(this.hidden[b]+((inputs[a]*ih[b+a])));
      }
    }
    this.outputs = [];
    for(g=0;g<output;g++){
      this.outputs.push(0);
    }
    for(q=0;q<output;q+=1){
      for(m=0;m<ho.length/output;m+=1){
        this.outputs[q] = this.outputs[q]+(this.hidden[m]*ho[(q)+m]);
      }
    }
    this.outputs[2] = this.sigmoid(this.outputs[2]);
    //console.log("Inputs: ",inputs,"Hidden: ",this.hidden,"Outputs: ",this.outputs);
    return this.outputs;
  }


  /* Old calcNN this.calcNN = function(inputs,ih,ho){
    this.in = inputs;
    this.ih = ih;
    this.h = [];
    this.ho = ho;
    this.out = [];

    this.h[0] = this.in[0]*this.ih[0]+this.in[1]*this.ih[1];
    this.h[1] = this.in[0]*this.ih[2]+this.in[1]*this.ih[3];
    this.h[2] = this.in[0]*this.ih[4]+this.in[1]*this.ih[5];
    this.h[0] = this.sigmoid(this.h[0]);
    this.h[1] = this.sigmoid(this.h[1]);
    this.h[2] = this.sigmoid(this.h[2]);

    this.out[0] = this.h[0]*this.ho[0]+this.h[1]*this.ho[1]+this.h[2]*this.ho[2];
    this.out[1] = this.h[0]*this.ho[3]+this.h[1]*this.ho[4]+this.h[2]*this.ho[5];
    this.out[0] = this.sigmoid(this.out[0]);
    this.out[0] = this.sigmoid(this.out[1]);
    return this.out;
  }*/
}
