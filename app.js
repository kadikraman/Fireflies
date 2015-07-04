/* constants */
var width = 1000;
var height = 600;
var padding = 20;
var numFireflies = 100;
var numStates = 10;

var svg = d3.select('#container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

/* Generate our random set of fireflies */
var fireflies = [];
for (var i = 0; i < numFireflies; i++){
    fireflies.push({
            x: getRandomInt(padding, width - padding),
            y: getRandomInt(padding, height - padding),
        state: Math.round(Math.random() * numStates)
    })
}

/* Generates a random integer in a range */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function redraw(){
    svg.selectAll('circle')
        .data(fireflies)
        .enter()
        .append('circle')
        .attr('class', function(d){
            if(d.state == 9){
                return 'blink'
            }
            else{
                return 'firefly'
            }
        })
        .attr('cx', function(d){
            return d.x
        })
        .attr('cy', function(d){
            return d.y
        })
        .attr('r', 10);
}

window.setInterval(function(){
    fireflies.forEach(function(firefly){
        if(firefly.state == 9){
            firefly.state = 0;
        }
        else{
            firefly.state +=1;
        }
    });
    svg.selectAll('circle').remove();
    redraw();
}, 1000);