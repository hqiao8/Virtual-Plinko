function Chip(x, y, d) {
  this.hue = random(360);
  var options = {
    density: 0.6,
    restitution: 0.8,
    friction: 0.01,
    frictionAir: 0.001 
  };
  this.d = d;
  this.body = Bodies.circle(x + random(-1,1), y, this.d / 2, options);
  World.add(world, this.body);
}

Chip.prototype.show = function() {
  fill(this.hue, 255, 255);
  noStroke();
  var pos = this.body.position;
  push();
  translate(pos.x, pos.y);
  ellipse(0, 0, this.d);
  pop();
};
