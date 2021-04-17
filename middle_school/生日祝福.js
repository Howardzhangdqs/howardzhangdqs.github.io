window.requestAnimFrame = ( function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
	function (callback) { window.setTimeout( callback, 1000 / 60 ); };
})();

// now we will setup our basic variables for the demo
var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	// full screen dimensions
	cw = window.innerWidth,
	ch = window.innerHeight,
	// firework collection
	fireworks = [],
	// particle collection
	particles = [],
	// starting hue
	hue = 120,
	// when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
	limiterTotal = 5,
	limiterTick = 0,
	// this will time the auto launches of fireworks, one launch per 80 loop ticks
	timerTotal = 80,
	timerTick = 0,
	mousedown = false,
	// mouse x coordinate,
	mx,
	// mouse y coordinate
	my,
	experssTo = "",
	experssTo2 = "";
	
// set canvas dimensions
canvas.width = cw;
canvas.height = ch;

// now we are going to setup our function placeholders for the entire demo

// get a random number within a range
function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}

// calculate the distance between two points
function calculateDistance( p1x, p1y, p2x, p2y ) {
	var xDistance = p1x - p2x,
		yDistance = p1y - p2y;
	return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

Date.prototype.format = function(fmt){
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};

	if (/(y+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
		
	for (var k in o){
		if (new RegExp("("+ k +")").test(fmt)){
		fmt = fmt.replace(
			RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
		}       
	}

	return fmt;
}

function init() {
	var person = new Array(),
		per_id = 0;
	per_id ++; person[per_id] = {name : "陈律言", birthday : new Date("January 13, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "江元泰", birthday : new Date("January 21, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "曲俐扬", birthday : new Date("January 24, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "杨弈婷", birthday : new Date("February 12, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "汪润琪", birthday : new Date("February 22, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "陈立舟", birthday : new Date("April 7, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "黄鑫玥", birthday : new Date("April 19, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "黄昶玮", birthday : new Date("May 1, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "俞越旸", birthday : new Date("May 11, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "金格如", birthday : new Date("May 23, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "葛耀洋", birthday : new Date("May 24, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "沈芊然", birthday : new Date("May 29, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "邵靖雯", birthday : new Date("June 6, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "李安祺", birthday : new Date("June 15, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "陈思豪", birthday : new Date("June 28, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "吴子嵘", birthday : new Date("June 30, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "勾育婧", birthday : new Date("July 2, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "马晋浩", birthday : new Date("July 20, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "李力蘅", birthday : new Date("August 17, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "李丰懿", birthday : new Date("September 29, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "蔡云裳", birthday : new Date("October 2, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "李奕敏", birthday : new Date("October 11, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "黄任飞", birthday : new Date("October 20, 2021 23:59:59")};
	per_id ++; person[per_id] = {name : "蒋宇臣", birthday : new Date("November 23, 2020 23:59:59")};
	per_id ++; person[per_id] = {name : "赵辰",   birthday : new Date("November 25, 2020 23:59:59")};
	per_id ++; person[per_id] = {name : "赵音茜", birthday : new Date("November 26, 2020 23:59:59")};
	var today = new Date;	//("November 27, 2020 11:10:25")
	var minn = 1000000;
	var numinn;
	for (var i = 1; i <= per_id; i ++){
		var dtdate = (person[i].birthday.getTime() - today.getTime()) / 1000 / 60 / 60 / 24;
		dtdate = Math.ceil(dtdate);
		if (dtdate > 1){
			if (person[i].birthday > today){
				if (minn > dtdate){
					minn = dtdate;
					numinn = i;
				}
			}
		}
		if (dtdate == 1){
			experssTo = person[i].name + " 生日快乐 !!!";
			experssTo2 = person[i].name + "生日快乐 !!!";
			document.title = experssTo2;
			return (experssTo);
		}
	}
	minn = minn - 1;
	experssTo = (numinn.toString() + " " + minn.toString());
	experssTo = "距离 " + (person[numinn].name) + " 的生日还有 " + minn.toString() + " 天";
	experssTo2 = "距离" + (person[numinn].name) + "的生日还有" + minn.toString() + "天";
	document.title = experssTo2;
	return (experssTo);
}

// create firework
function Firework( sx, sy, tx, ty ) {
	// actual coordinates
	this.x = sx;
	this.y = sy;
	// starting coordinates
	this.sx = sx;
	this.sy = sy;
	// target coordinates
	this.tx = tx;
	this.ty = ty;
	// distance from starting point to target
	this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
	this.distanceTraveled = 0;
	// track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 3;
	// populate initial coordinate collection with the current coordinates
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = Math.atan2( ty - sy, tx - sx );
	this.speed = 2;
	this.acceleration = 1.05;
	this.brightness = random( 50, 70 );
	// circle target indicator radius
	this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function( index ) {
	// remove last item in coordinates array
	this.coordinates.pop();
	// add current coordinates to the start of the array
	this.coordinates.unshift( [ this.x, this.y ] );
	
	// cycle the circle target indicator radius
	if( this.targetRadius < 8 ) {
		this.targetRadius += 0.3;
	} else {
		this.targetRadius = 1;
	}
	
	// speed up the firework
	this.speed *= this.acceleration;
	
	// get the current velocities based on angle and speed
	var vx = Math.cos( this.angle ) * this.speed,
		vy = Math.sin( this.angle ) * this.speed;
	// how far will the firework have traveled with velocities applied?
	this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );
	
	// if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
	if( this.distanceTraveled >= this.distanceToTarget ) {
		createParticles( this.tx, this.ty );
		// remove the firework, use the index passed into the update function to determine which to remove
		fireworks.splice( index, 1 );
	} else {
		// target not reached, keep traveling
		this.x += vx;
		this.y += vy;
	}
}

// draw firework
Firework.prototype.draw = function() {
	ctx.beginPath();
	// move to the last tracked coordinate in the set, then draw a line to the current x and y
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
	ctx.stroke();
	
	ctx.beginPath();
	// draw the target for this firework with a pulsing circle
	ctx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
	ctx.stroke();
}

// create particle
function Particle( x, y ) {
	this.x = x;
	this.y = y;
	// track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 5;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	// set a random angle in all possible directions, in radians
	this.angle = random( 0, Math.PI * 2 );
	this.speed = random( 1, 10 );
	// friction will slow the particle down
	this.friction = 0.95;
	// gravity will be applied and pull the particle down
	this.gravity = 2;
	// set the hue to a random number +-20 of the overall hue variable
	this.hue = random(hue - 20, hue + 20);
	this.brightness = random(50, 80);
	this.alpha = 1;
	// set how fast the particle fades out
	this.decay = random(0.015, 0.03);
}

Particle.prototype.update = function( index ) {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	this.speed *= this.friction;
	this.x += Math.cos(this.angle) * this.speed;
	this.y += Math.sin(this.angle) * this.speed + this.gravity;
	this.alpha -= this.decay;
	
	if( this.alpha <= this.decay ) {
		particles.splice(index, 1);
	}
}

Particle.prototype.draw = function() {
	  
  ctx. beginPath();
	ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
	ctx.lineTo(this.x, this.y);
	ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
	ctx.stroke();
  
  
}

function createParticles( x, y ) {
	var particleCount = 30;
	while ( particleCount --) {
		particles.push( new Particle( x, y ) );
	}
}

function loop() {
	cw = window.innerWidth;
	ch = window.innerHeight;
	canvas.width = cw;
	canvas.height = ch;
	
	requestAnimFrame( loop );
	
	hue += 0.5;
	
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect( 0, 0, cw, ch );
	ctx.globalCompositeOperation = 'lighter';
	
	if (experssTo == "") experssTo = init();
	ctx.font = "50px sans-serif";
	var textData = ctx.measureText(experssTo);
	ctx.fillStyle = "rgba(" + parseInt(random(100, 255)) + "," + parseInt(random(100, 255)) + "," + parseInt(random(100, 255)) + ",0.5)";
	ctx.fillText(experssTo, cw / 2 - textData.width / 2, ch / 2); 
  
	var i = fireworks.length;
	while (i --) {
		fireworks[i].draw();
		fireworks[i].update(i);
	}
	
	var i = particles.length;
	while (i --) {
		particles[i].draw();
		particles[i].update(i);
	}
	
	if (timerTick >= timerTotal) {
		if (! mousedown ) {

for(var h=0;h<50;h++){
	fireworks.push( new Firework( cw / 2, ch / 2, random( 0, cw ), random( 0, ch )));
}
timerTick = 0;
		}
	} else {
		timerTick ++;
	}
	
	// limit the rate at which fireworks get launched when mouse is down
	if( limiterTick >= limiterTotal ) {
		if( mousedown ) {
// start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
fireworks.push( new Firework( cw / 2, ch / 2, mx, my ) );
limiterTick = 0;
		}
	} else {
		limiterTick ++;
	}
}

// mouse event bindings
// update the mouse coordinates on mousemove
canvas.addEventListener( 'mousemove', function( e ) {
	mx = e.pageX - canvas.offsetLeft;
	my = e.pageY - canvas.offsetTop;
});

// toggle mousedown state and prevent canvas from being selected
canvas.addEventListener( 'mousedown', function( e ) {
	e.preventDefault();
	mousedown = true;
});

canvas.addEventListener( 'mouseup', function( e ) {
	e.preventDefault();
	mousedown = false;
});

// once the window loads, we are ready for some fireworks!
window.onload = loop;