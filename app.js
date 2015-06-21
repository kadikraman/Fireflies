var width = 500;
var height = 200;

var fireflies = [
    { x: 50, y: 50, state: Math.floor((Math.random() * 10)) },
    { x: 50, y: 100, state: Math.floor((Math.random() * 10)) },
    { x: 50, y: 150, state: Math.floor((Math.random() * 10)) },
    { x: 100, y: 50, state: Math.floor((Math.random() * 10)) },
    { x: 100, y: 100, state: Math.floor((Math.random() * 10)) },
    { x: 100, y: 150, state: Math.floor((Math.random() * 10)) },
    { x: 150, y: 50, state: Math.floor((Math.random() * 10)) },
    { x: 150, y: 100, state: Math.floor((Math.random() * 10)) },
    { x: 150, y: 150, state: Math.floor((Math.random() * 10)) }
];

var svg = d3.select('#container')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

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