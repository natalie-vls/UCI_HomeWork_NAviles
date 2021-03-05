// Create SVG object 

var width = parseInt(d3.select("#scatter").style("width"));

var height = width * 2/3;
var margin = 20;
var labelArea = 110;
var padding = 40;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// X axes Labels
svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

//Transfrom to xText
var bottomTextX =  (width - labelArea)/2 + labelArea;
var bottomTextY = height - margin - padding;
xText.attr("transform",`translate(
    ${bottomTextX}, 
    ${bottomTextY})`
    );

// Create X-axis for each (Poverty, Age, Income)
xText
  .append("text")
  .attr("y", -20)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

  xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");

  xText
  .append("text")
  .attr("y", 20)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

// Y Axis labels
svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");
 
// Tranform to yText
var leftTextX =  margin + padding;
var leftTextY = (height + labelArea) / 2 - labelArea;
yText.attr("transform",`translate(
    ${leftTextX}, 
    ${leftTextY}
    )rotate(-90)`
    );

// Create Y-axis for each (Obesity, Smoke, Healthcare)

yText
  .append("text")
  .attr("y", -20)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

yText
  .append("text")
  .attr("y", 20)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

//Create Radius

var circRadius;
function adjustRadius() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
adjustRadius();

// Import & Visualize Data
d3.csv("assets/data/data.csv").then(function(data) {
    visualize(data);
});

function visualize(csvData) {
    var currentX = "poverty";
    var currentY = "obesity";
    var xMin;
    var xMax;
    var yMin;
    var yMax;

// Tool Tip 
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
        var xline;
        var stateline = "<div>" + d.state + "</div>";
        var yline = "<div>" + currentY + ": " + d[currentY] + "%</div>";
        if (currrentX === "poverty") {
            xline = "<div>" + currentX + ": " + d[currentX] + "%</div>";
      }
        else {
            xline = "<div>" +
          currentX +
          ": " +
          parseFloat(d[currentX]).toLocaleString("en") +
          "</div>";
      }
        return stateline + xline + yline;
    });
// Call function.
svg.call(toolTip);


// Find the Data Max and Min
function xMinMax() {
    xMin = d3.min(csvData, function(d) {
      return parseFloat(d[currentX]) * 0.85;
    });

    xMax = d3.max(csvData, function(d) {
      return parseFloat(d[currentX]) * 1.15;
    });
  }

function yMinMax() {
    yMin = d3.min(csvData, function(d) {
      return parseFloat(d[currentY]) * 0.85;
    });

    yMax = d3.max(csvData, function(d) {
      return parseFloat(d[currentY]) * 1.15;
    });
  }

  // UPdate axis
function labelChange(axis, clickText) {
    d3.selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    clickText.classed("inactive", false).classed("active", true);
  }

// Scatter Plot

xMinMax();
yMinMax();

var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);

var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

// Create scaled axis

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

// Calculate counts
function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

// Append axis to SGV as groups

svg.append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
svg.append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

var allCircles = svg.selectAll("g allCircles").data(csvData).enter();

allCircles.append("circle")
    .attr("cx", function(d) {
      return xScale(d[currentX]);
    })
    .attr("cy", function(d) {
      return yScale(d[currentY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })

    .on("mouseover", function(d) {
      toolTip.show(d, this);
      d3.select(this).style("stroke", "#323232");
    })

    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select(this).style("stroke", "#e3e3e3");
    });

// Add State text to cirlces

allCircles
    .append("text")
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    
    .attr("dx", function(d) {
      return xScale(d[currentX]);
    })

    .attr("dy", function(d) {
      return yScale(d[currentY]) + circRadius / 3;
    })

    .text(function(d) {
        return d.abbr;
      })

    .on("mouseover", function(d) {
      toolTip.show(d);
      d3.select("." + d.abbr).style("stroke", "#323232");
    })

    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

// Make Dynamic Graph
d3.selectAll(".aText").on("click", function() {
    var self = d3.select(this);

    if (self.classed("inactive")) {
        var axis = self.attr("data-axis");
        var name = self.attr("data-name");
        
        if (axis === "x") {
        currentX = name;

        xMinMax();
        xScale.domain([xMin, xMax]);

        svg.select(".xAxis")
            .transition().duration(600)
            .call(xAxis);

        d3.selectAll("circle").each(function() {
          d3.select(this)
            .transition().duration(600)
            .attr("cx", function(d) {
              return xScale(d[currentX]);
            });
        });

        d3.selectAll(".stateText").each(function() {
          d3.select(this)
            .transition().duration(600)
            .attr("dx", function(d) {
              return xScale(d[currentX]);
            });
        });

// Update labels

        labelChange(axis, self);
      }

      else {
        currentY = name;

        yMinMax();
        yScale.domain([yMin, yMax]);

        svg.select(".yAxis")
            .transition().duration(600)
            .call(yAxis);

        d3.selectAll("circle").each(function() {
          d3.select(this)
            .transition().duration(600)
            .attr("cy", function(d) {
              return yScale(d[currentY]);
            });
        });

        d3.selectAll(".stateText").each(function() {
          d3.select(this)
            .transition().duration(600)
            .attr("dy", function(d) {
              return yScale(d[currentY]) + circRadius / 3;
            });
        });

        labelChange(axis, self);
      }
    }
  });

}