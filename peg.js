function Peg(x, y, w, h) {
  var options = {
    density: 0.8,
    restitution: 0.6,
    friction: 0.01,
    isStatic: true
  };
  this.body = Bodies.rectangle(x, y, w, h, options);
  this.w = w;
  this.h = h;
  World.add(world, this.body);
}

Peg.prototype.show = function() {
  fill(255);
  stroke(255);
  var pos = this.body.position;
  push();
  translate(pos.x, pos.y);
  rectMode(CENTER);
  rect(0, 0, this.w, this.h);
  pop();
};
