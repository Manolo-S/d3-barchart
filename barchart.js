'use strict';

var dataSourceUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
var from_date;
var to_date;
var description;
var ds; //empty var for dataset (ds)

var parseDate = d3.time.format('%Y-%m-%d').parse;



var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 100
};
var width = 700 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
console.log('height: ', height);
console.log('width:', width);


function buildLine() {

    var numberFormat = d3.format("$,.2");
    var timeFormat = d3.time.format("%Y %B");

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    x.domain(d3.extent(ds, function(d) {
        return parseDate(d[0])
    }));
    y.domain([0, d3.max(ds, function(d) {
        return d[1]
    })]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(14);
    var yAxis = d3.svg.axis().scale(y).orient('left').ticks(9);

    var area = d3.svg.area()
        .x(function(d) {
            return x(parseDate(d[0]));
        })
        .y0(height)
        .y1(function(d) {
            return y(d[1]);
        })


    var lineFun = d3.svg.line()
        .x(function(d) {
            return x(parseDate(d[0]));
        })
        .y(function(d) {
            return y(d[1]);
        })
        .interpolate("linear");

    var svg = d3.select("body")
        .append("svg").attr({
            width: width + margin.left + margin.right,
            height: height + margin.top + margin.bottom
        })
        .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');



    svg.selectAll("rect")
        .data(ds)
        .enter()
        .append("rect")
        .attr({
            x: function(d) {
                return x(parseDate(d[0]));
            },
            y: function(d) {
                return y(d[1])
            },
            width: width / ds.length,
            height: function(d) {
                return (height - y(d[1]))
            },
            fill: 'lightsteelblue'
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(100)
                .style("opacity", .9);
            tooltip.html("<strong>" + numberFormat(d[1]) + "</strong><p>" + timeFormat(parseDate(d[0])) + "</p>")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(100)
                .style("opacity", 0);
        });



    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
}

d3.json(dataSourceUrl, function(error, data) {

    if (error) {
        console.log(error);
    } else {
        ds = data.data;
        description = data.description;
        from_date = data.from_date;
        to_date = data.to_date;
    }

    buildLine();

});