var width = 1500,
        height = 200,
        cellSize = 18; // cell size

    var percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");

    var maxIntensity = 10;
    var minIntensity = 0;

    var color = d3.scale.linear()
        .domain([0, 6, 10])
        .range(["yellow","orange", "crimson"]);

    var svg = d3.select("#tracker").selectAll("svg")
        .data(d3.range(2015,2016))
      .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")

        // This line was disabling color coding
        .attr("transform", "translate(-375,30)");

    svg.append("text")
        .attr("transform", "translate(550," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return "Aug " + d; });

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(d, 7, 1), new Date(d + 1, 0, 1)); })
      .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
        .attr("y", function(d) { return d.getDay() * cellSize; })
        .datum(format);

    rect.append("title")
        .text(function(d) { return d; });

    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(d, 7, 1), new Date(d + 1, 0, 1)); })
      .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);

    d3.json("./assets/json/exercise.json", function(error, data) {
      if (error) throw error;

      data.forEach(function(d) {
        d.dd = format(format.parse(d.Date));
      });

      var nest = d3.nest()
        .key(function(d) { return d.dd; })
        .map(data);

      rect.filter(function(d) { return d in nest; })

          .style("fill", function(d) { 
          
            switch(nest[d][0].Type){
              case "Hiking": return "cornflowerblue";
              case "Gym": return "orangered";
              case "Basketball": return "gold"
              default: return "mediumpurple";
            }


          })
          .select("title")
          .text(function(d) { return d + ", Type: " + nest[d][0].Type; });
    });

    function monthPath(t0) {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
          d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
      return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
          + "H" + w0 * cellSize + "V" + 7 * cellSize
          + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
          + "H" + (w1 + 1) * cellSize + "V" + 0
          + "H" + (w0 + 1) * cellSize + "Z";
    }

    // Legend explaining color scheme
    var legend = d3.select("body").selectAll("svg").append("g");

      legend
        .attr("width",400)
        .attr("height",150)
        .attr("transform","translate(20,50)");
      legend
        .append("rect")
        .style("fill","cornflowerblue")
        .attr("class","day")
        .attr("width",cellSize)
        .attr("height",cellSize)
        .attr("y",0);
      legend
        .append("rect")
        .style("fill","orangered")
        .attr("class","day")
        .attr("width",cellSize)
        .attr("height",cellSize)
        .attr("y", 1 * cellSize);
      legend
        .append("rect")
        .style("fill","mediumpurple")
        .attr("class","day")
        .attr("width",cellSize)
        .attr("height",cellSize)
        .attr("y", 2 * cellSize);
      legend
        .append("rect")
        .style("fill","gold")
        .attr("class","day")
        .attr("width",cellSize)
        .attr("height",cellSize)
        .attr("y", 3 * cellSize);
      legend
        .append("text")
        .text("Type of Exercise")
        .attr("x",0)
        .attr("y",-8);
      legend
        .append("text")
        .text("Hiking")
        .attr("x",cellSize + 5)
        .attr("y",cellSize);
      legend
        .append("text")
        .text("Gym")
        .attr("x",cellSize + 5)
        .attr("y",2 * cellSize);
      legend
        .append("text")
        .text("Rock Climbing")
        .attr("x",cellSize + 5)
        .attr("y",3 * cellSize);
      legend
        .append("text")
        .text("Basketball")
        .attr("x",cellSize + 5)
        .attr("y",4 * cellSize);

    var gauge1 = d3.select("#goal_pcf").append("div").attr("class","chart-gauge");

    // var gaugeText = d3.select("#goal_pcf").append("text").text("These gauges will show my fitness goal progress.").attr("class","header");

    // TODO Multiple gauges
    // var gauge2 = d3.select("body").append("div").attr("class","chart-gauge");
    // var gauge3 = d3.select("body").append("div").attr("class","chart-gauge");

