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

    d3.json("./assets/json/Exercise.json", function(error, data) {
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
              case "Hiking": return "#FF851B";
              case "Gym": return "#0074D9";
              case "Basketball": return "gold"
              default: return "#001f3f";
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
        .style("fill","#FF851B")
        .attr("class","day")
        .attr("width",cellSize)
        .attr("height",cellSize)
        .attr("y",0);
      legend
        .append("rect")
        .style("fill","#0074D9")
        .attr("class","day")
        .attr("width",cellSize)
        .attr("height",cellSize)
        .attr("y", 1 * cellSize);
      legend
        .append("rect")
        .style("fill","#001f3f")
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

        // Percent Body Fat Box
        var bodyFatId = "#GoalPercentBodyFat";
        var initialBodyFatPercentage = 15;
        // var gauge1 = d3.select(bodyFatId).append("div").attr("class","chart-gauge");
        var pcfsvg = d3.select(bodyFatId).append("svg").attr("width",450).attr("height",300);
        d3.json("./assets/json/BodyComposition.json", function(error, data) {
          if (error) throw error;
          var bodyFatPercentage = data[0]["Obesity Analysis"]["Percent Body Fat"];
          pcfsvg.append("text").text(bodyFatPercentage+"%").attr("y","130").attr("x","100").style("font-size","150px").style("fill","#0074D9");
          d3.select(oneMileTimeId).append("h2").text("Percent Body Fat Loss - Current: "+ bodyFatPercentage + "% / Target: 12.0%");
        });

        // 1 Mile Time box
        var oneMileTimeId = "#Goal1MileTime"
        var miletime = d3.select(oneMileTimeId).append("svg").attr("width",400)
        .attr("height",300);
        var mileTimeValue = "0:00"; 

        d3.json("./assets/json/1MileTimes.json", function(error, data) {
          if (error) throw error;
          mileTimeValue = data[0].Time;
          miletime.append("text").text(mileTimeValue).attr("y","130").attr("x","75").style("font-size","150px").style("fill","#3D9970");
          d3.select(oneMileTimeId).append("h2").text("1 Mile Time - Current: " + mileTimeValue + " / Target: 6:00");
        });

        // 10 Rep Bench Max Box
        var benchMaxId = "#Goal10RepBenchMax"
        var benchMaxValue = "145lbs";
        d3.select(benchMaxId).append("svg").attr("width",450).attr("height",300).append("text").text(benchMaxValue).attr("y","130").attr("x","25").style("font-size","150px").style("fill","#0074D9");

        // Free Throws
        var freeThrowsId = "#GoalFreeThrows";
        var freeThrowsValue = "40%";
        d3.select(freeThrowsId).append("svg").attr("width",300).attr("height",275).append("text").text(freeThrowsValue).attr("y","130").attr("x","15").style("font-size","150px").style("fill","#E82C0C");

        // Pull Ups
        var pullUpsId = "#GoalPullUps";
        var pullUpsValue = 10;
        d3.select(pullUpsId).append("svg").attr("width",300).attr("height",275).append("text").text(pullUpsValue).attr("y","130").attr("x","70").style("font-size","150px").style("fill","#E82C0C");

    // var gaugeText = d3.select("#goal_pcf").append("text").text("These gauges will show my fitness goal progress.").attr("class","header");

    // TODO Multiple gauges
    // var gauge2 = d3.select("body").append("div").attr("class","chart-gauge");
    // var gauge3 = d3.select("body").append("div").attr("class","chart-gauge");

