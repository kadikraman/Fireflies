/* variables to use throughout */
var width = window.innerWidth-20;
var height = window.innerHeight;
var padding = 20;
var numFireflies = Math.round(width * height * 0.0005);
var speed = 250;
var maxState = 9;
var fireflyRadius = 5;
var influenceRadius = 100;
var showState = false;
var moving = false;
var svg = getSvg();
var fireflies = generateFireflies();

function ViewModel(){
    this.numFireflies = ko.observable(numFireflies);
    this.speed = ko.observable(speed);
    this.numFireflies.subscribe(function(val){
        numFireflies = val;
        load();
    });
    this.speed.subscribe(function(val){
        speed = val;
        load();
    });
}

ko.applyBindings(new ViewModel());

function toggleFilters(){
    var settings = $('#settings');
    if(settings.css('display') === 'none'){
        settings.css('display', 'block');
    }
    else{
        settings.css('display', 'none');
    }
}

/* Initial loading */
load();

/* Resets the simulation */
function load(){
    width = window.innerWidth-20;
    height = window.innerHeight;
    numFireflies = document.getElementById('inputNumFireflies').value;
    speed = document.getElementById('inputSpeed').value;
    svg = getSvg();
    fireflies = generateFireflies();
}

function getSvg() {
    return d3.select('#fireflies')
        .attr('width', width)
        .attr('height', height);
}

function generateFireflies() {
    /* Generate our random set of fireflies */
    var fireflies = [];
    for (var i = 0; i < numFireflies; i++) {
        fireflies.push({
            x: getRandomInt(padding, width - padding),
            y: getRandomInt(padding, height - padding),
            state: Math.round(Math.random() * maxState)
        });
    }
    return fireflies;
}

/* Helper method. Generates a random integer in a range */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* Draws the fireflies */
function redraw(){
    svg.selectAll('circle').remove();
    svg.selectAll('text').remove();

    svg.selectAll('circle')
        .data(fireflies)
        .enter()
        .append('circle')
        .attr('class', function(d){
            if(d.state === 9){
                return 'blink';
            }
            else{
                return 'firefly';
            }
        })
        .attr('cx', function(d){
            return d.x;
        })
        .attr('cy', function(d){
            return d.y;
        })
        .attr('r', fireflyRadius)
        .transition()
            .duration(speed/2)
            .attr('r', function(d){
                if(d.state === 9){
                    return 20;
                }
                else{
                    return fireflyRadius;
                }
            })
        .transition()
            .duration(speed/2)
            .attr('r', function(d){
                return fireflyRadius;
            });

    if(showState){
        svg.selectAll('text')
            .data(fireflies)
            .enter()
            .append('text')
            .text(function(d){
                return d.state;
            })
            .attr('x', function(d){
                return d.x;
            })
            .attr('y', function(d){
                return d.y;
            });
    }
}

/* Interval which calculates the next state of the fireflies */
var nextFireflyIteration = function () {

    /*
     Record all if the current influence ranges
     If a firefly has blinked, then the area around it of radius <<influenceRadius>> will be in influence range
     */
    var influenceRanges = [];
    fireflies.forEach(function (firefly) {
        if (firefly.state === maxState) {
            influenceRanges.push({
                x: [firefly.x - influenceRadius, firefly.x + influenceRadius],
                y: [firefly.y - influenceRadius, firefly.y + influenceRadius]
            });
        }
    });

    /*
     When calculating the next state, if the firefly's current state is 6 or under AND it is in the influence range,
     the next time step it will load to zero.
     */
    fireflies.forEach(function (firefly) {
        if (firefly.state === maxState) {
            firefly.state = 0;
        }
        else if (firefly.state <= 6) {
            var needsReset = false;
            influenceRanges.forEach(function (range) {
                if (firefly.x > range.x[0] && firefly.x < range.x[1] && firefly.y > range.y[0] && firefly.y < range.y[1]) {
                    needsReset = true;
                }
            });
            needsReset ? firefly.state = 0 : firefly.state += 1;
        }
        else {
            firefly.state += 1;
        }
    });
    redraw();
    setTimeout(nextFireflyIteration, speed);
};

/* Sets the initial timeout */
setTimeout(nextFireflyIteration, speed);

/* Interval for moving the fireflies */
var moveFirefly = function() {
    var xchange = 0;
    var ychange = 0;
    fireflies.forEach(function (firefly) {
        xchange = getRandomInt(-5, 5);
        ychange = getRandomInt(-5, 5);
        firefly.x = firefly.x + xchange;
        firefly.y = firefly.y + ychange;
    });
    redraw();

    if(moving){
        setTimeout(moveFirefly, 100);
    }
};

/* Handles the toggle movement button click */
function toggleMovement(){
    if(moving){
        moving = false;
    }
    else{
        setTimeout(moveFirefly, 100);
        moving = true;
    }
}