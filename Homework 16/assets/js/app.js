// Responsive interactive d3 scatter plot script
// Uses code from class activities

function makeResponsive(){
    var initSvg = d3.select('#scatter').select('svg');
    if (!initSvg.empty()) {
        initSvg.remove();
    }
    // Setting SVG parameters
    var svgHeight = window.innerHeight*0.8;
    var svgWidth = window.innerWidth;

    // margins
    var margin = {
        top: svgHeight/12,
        right: svgWidth/15,
        bottom: svgHeight/12,
        left: svgWidth/15
    };
    var chartH = svgHeight - margin.top - margin.bottom;
    var chartW = svgWidth - margin.right - margin.left;

    var chartSvg = d3.select('#scatter')
        .append('svg')
        .attr('height', svgHeight)
        .attr('width', svgWidth);
    
    var scatterChartG = chartSvg.append('g')
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // set default axis
    var currentX = 'poverty';
    var currentY = 'healthcare';
    // Data changing functions
    // use activity 16.3.12 as base
    // separate options for x and y
    function setScale(data, chosenAxis,option) {
        if (option === 'x'){
            var scale = d3.scaleLinear()
            .domain([d3.min(data, d => d[chosenAxis]) * 0.8,
            d3.max(data, d => d[chosenAxis]) * 1.2
            ])
            .range([0, chartW]);
        }else{
            var scale = d3.scaleLinear()
            .domain([d3.min(data, d => d[chosenAxis]) * 0.8,
            d3.max(data, d => d[chosenAxis]) * 1.2
            ])
            .range([chartH, 0]);
        }        
        return scale;
    }
    function renderAxes(newScale, Axis, option) {
        if (option === 'x'){
            var bottomAxis = d3.axisBottom(newScale);
            Axis.transition()
            .duration(1000)
            .call(bottomAxis);
        }else{
            var leftAxis = d3.axisLeft(newScale);
            Axis.transition()
            .duration(1000)
            .call(leftAxis);
        }
        return Axis;
    }
    function renderCircles(circlesGroup, newScale, chosenAxis, option){
        if (option === 'x'){
            circlesGroup.transition()
                .duration(1000)
                .attr("cx", d => newScale(d[chosenAxis]));
        }else{
            circlesGroup.transition()
                .duration(1000)
                .attr("cy", d => newScale(d[chosenAxis]));
        }
        return circlesGroup;
    }
    function renderAbbr(abbrGroup, newScale, chosenAxis, option) {
        if (option === 'x'){
        abbrGroup.transition()
            .duration(1000)
            .attr("x", d => newScale(d[chosenAxis]));
        }else{
            abbrGroup.transition()
            .duration(1000)
            .attr("y", d => newScale(d[chosenAxis]));
        }
        return abbrGroup;
    }
    
    function updateToolTip(x,y, circlesGroup) {
        var labelXStart;
        var labelXEnd;
        var labelY;
        if (x == "poverty") {
          labelXStart = "Poverty: ";
          labelXEnd = '%'
        }
        else {
          labelXStart = "Age: ";
          labelXEnd = '';
        }
        if (y == "healthcare") {
            labelY = "Healthcare: ";
          }
          else {
            labelY = "Smokers: ";
          }
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .html(function(d) {
            return (`${d.state}<br>${labelXStart+d[currentX]+labelXEnd}<br>
            ${labelY} ${d[currentY]}%`);
          });
        circlesGroup.call(toolTip);
        circlesGroup.on("mouseover", function(data) {
          toolTip.show(data);
        })
          // onmouseout event
          .on("mouseout", function(data) {
            toolTip.hide(data);
          });
        return circlesGroup;
      }

    // Import csv using d3
    d3.csv('assets/data/data.csv').then((censusData =>{
        // format data
        censusData.forEach((row)=>{
            row.poverty = +row.poverty;
            row.healthcare = +row.healthcare;
            row.age = +row.age;
            row.smokes = +row.smokes;
        });

        var xScale = setScale(censusData, currentX,'x');
        var yScale = setScale(censusData, currentY,'y');

        var bottomAxis =d3.axisBottom(xScale);
        var leftAxis =d3.axisLeft(yScale);

        var xAxis = scatterChartG.append('g')
            .attr("transform", `translate(0, ${chartH})`)
            .call(bottomAxis);
        var yAxis = scatterChartG.append("g")
            .call(leftAxis);
        
        var circles = scatterChartG.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[currentX]))
            .attr("cy", d => yScale(d[currentY]))
            .attr("r", "12")
            .attr("fill", "lightblue")
            .attr("stroke","black")
            .attr("opacity", ".8");
        
        // Add state abbreviations to circles
        // Had some trouble with data not binding for all states
        // So used a forEach function instead
        // var statesText = scatterChartG.selectAll('text')
        //     .data(censusData)
        //     .enter()
        //     .append('text')
        //     .attr("x", d => xScale(d.poverty))
        //     .attr("y", d => yScale(d.healthcare))
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", "8px")
        //     .attr('text-anchor', 'middle')
        //     .attr("fill", "white")
        //     .text(d=> d.abbr);
        censusData.forEach((row)=>{
            scatterChartG.append('text')
            .attr("x", xScale(row.poverty))
            .attr("y", yScale(row.healthcare)+2)
            .attr("font-family", "sans-serif")
            .attr("font-size", "8px")
            .attr('text-anchor', 'middle')
            .attr("fill", "grey")
            .classed("stateABBR", true)
            .text(row.abbr)
        });
        abbrGroup = scatterChartG.selectAll('.stateABBR')
            .data(censusData);
        
        // Create axis labels
        var healthLabel = scatterChartG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartH *0.5))
        .attr("dy", "1em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("value", "healthcare")
        .classed("active clickable", true)
        .text("Lacks Healthcare(%)");
        
        var smokeLabel = scatterChartG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left*0.6)
        .attr("x", 0 - (chartH *0.5))
        .attr("dy", "1em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("value", "smokes")
        .classed("inactive clickable", true)
        .text("Smokes(%)");

        var povertyLabel = scatterChartG.append("text")
        .attr("transform", `translate(${chartW / 2+margin.left}, ${chartH + margin.top*0.8})`)
        .attr("font-size", "12px")
        .attr("value", "poverty")
        .classed("active clickable", true)
        .text("In Poverty(%)");

        var ageLabel = scatterChartG.append("text")
        .attr("transform", `translate(${chartW / 2-margin.left}, ${chartH + margin.top*0.8})`)
        .attr("font-size", "12px")
        .attr("value", "age")
        .classed("inactive clickable", true)
        .text("Age (median)");
        // tooltips
        var circles = updateToolTip(currentX, currentY, circles);


        // handle click event
        scatterChartG.selectAll('.clickable')
        .on('click',function(){
            var value = d3.select(this).attr("value");
            if (value !== currentX | value !== currentY) {
                // if click on a x label
                // change currentX value and call update functions
                if (value === 'poverty' | value === 'age'){
                    currentX = value;
                    xScale = setScale(censusData, currentX,'x');
                    xAxis = renderAxes(xScale, xAxis,'x');
                    circles = renderCircles(circles, xScale, currentX,'x');
                    abbrGroup = renderAbbr(abbrGroup, xScale, currentX,'x');
                    if (currentX === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    }
                    else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    }
                }else{
                    currentY = value;
                    yScale = setScale(censusData, currentY,'y');
                    yAxis = renderAxes(yScale, yAxis,'y');
                    circles = renderCircles(circles, yScale, currentY,'y');
                    abbrGroup = renderAbbr(abbrGroup, yScale, currentY,'y');
                    if (currentY === "healthcare") {
                    healthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    }
                    else {
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    }
                }
                // update tooltips
                circles = updateToolTip(currentX,currentY, circles);
              }
        });
    })).catch(function(error) {
        console.log(error);
    });
}

makeResponsive();
d3.select(window).on('resize', makeResponsive);
