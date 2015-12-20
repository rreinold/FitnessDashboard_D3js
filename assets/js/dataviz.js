    var width = 1500,
        height = 200,
        cellSize = 18; // cell size

    var defaultSVGHeight = 170;
    var defaultSVGVerticalCenter = (defaultSVGHeight / 2);

    var percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");

    var typesOfExercise = 
      {
        StrengthTraining: {color:"#0074D9"},
        Basketball:       {color:"gold"},
        Hiking:           {color:"#FF851B"},
        Running:          {color:"#2ECC40"},
        RockClimbing:     {color:"#001f3f"}
      }
    var defaultExerciseColor = "purple";

    var svg = d3
        .select("#tracker")
        .selectAll("svg")
        .data(d3.range(2015,2016))
        .enter()
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(-500,30)");

    svg.append("text")
        .attr("transform", "translate(690," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return "4Q " + d; });

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(d, 9, 1), new Date()); })
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
        .data(function(d) { return d3.time.months(new Date(d, 9, 1), new Date(d + 1, 0, 1)); })
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
          
            for(var type in typesOfExercise){
              if (nest[d][0].Type == type){
                return typesOfExercise[type].color;
              }
            }

            return defaultExerciseColor;

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

    // Create legend for each exercise type
    var legend = d3.select("#tracker").selectAll("svg").append("g");
      legend
        .attr("transform","translate(20,50)")

      legend
        .append("text")
        .text("Type of Exercise")
        .attr("x",0)
        .attr("y",-8);

        var yIncrement = 0;
        for(var type in typesOfExercise){
        legend
          .append("rect")
          .attr("class","day")
          .attr("width",cellSize)
          .attr("height",cellSize)
          .style("fill",typesOfExercise[type].color)
          .attr("y",yIncrement * cellSize);

          // TODO: Why does this need to incremented here?
        yIncrement++;

        legend
          .append("text")
          .text(type)
          .attr("x",cellSize + 5)
          .attr("y",yIncrement * cellSize);

        }

        var reel = "#reel";


        // TODO: Implement
        // var gauge1 = d3.select(bodyFatId).append("div").attr("class","chart-gauge");

        var addArticle = function(id, width){
          return d3
            .select(reel)
            .append("article")
            .attr("class","item thumb")
            .attr("id",id)
        
            .attr("data-width",width);
        };

        // Percent Body Fat Box
        var bodyFatId = "#GoalPercentBodyFat";
        var initialBodyFatPercentage = 15;
        var bodyFatWidth = 400;
        var bodyFatHorizontalCenter = (bodyFatWidth / 2);
        var bodyFatVerticalCenter = (defaultSVGHeight / 2);

        var article_bodyFat = addArticle(bodyFatId, bodyFatWidth);
        var svg_bodyFat = article_bodyFat
            .append("svg")
            .attr("width",bodyFatWidth)
            .attr("height",defaultSVGHeight);

        svg_scale = svg_bodyFat
          .append("g")
          .attr("transform","translate(" + (bodyFatHorizontalCenter / 16) + "," + (bodyFatVerticalCenter/2) + ") scale(1)")
          .append("g");
        svg_scale
          .append("path")
          .attr("fill","#000000")
          .attr("d","M89,3c4.411,0,8,3.589,8,8v78c0,4.411-3.589,8-8,8H11c-4.411,0-8-3.589-8-8V11c0-4.411,3.589-8,8-8H89     M31.466,42.708l2.121-2.121c4.785-4.784,11.146-7.419,17.913-7.419s13.128,2.635,17.913,7.419l2.121,2.121l2.121-2.121    l15.321-15.321l2.121-2.121l-2.121-2.121C78.967,11.013,65.657,5.5,51.5,5.5s-27.467,5.513-37.477,15.523l-2.121,2.121    l2.121,2.121l15.321,15.321L31.466,42.708 M89,0H11C4.925,0,0,4.925,0,11v78c0,6.075,4.925,11,11,11h78c6.075,0,11-4.925,11-11V11    C100,4.925,95.075,0,89,0L89,0z M31.466,38.466L16.145,23.145C25.908,13.381,38.704,8.5,51.5,8.5s25.592,4.881,35.355,14.645    L71.534,38.466c-5.532-5.532-12.783-8.298-20.034-8.298S36.998,32.934,31.466,38.466L31.466,38.466z");
        svg_scale  
          .append("polygon")
          .attr("points","50,28 52,16 54,28");

      
        d3.json("./assets/json/BodyComposition.json", function(error, data) {
          if (error) throw error;

          var bodyFatPercentage = data[0]["Obesity Analysis"]["Percent Body Fat"];

          svg_bodyFat
          .append("text")
            .text(bodyFatPercentage+"%")
            .attr("text-anchor","middle")
            .attr("dominant-baseline", "central")
            .attr("y",defaultSVGVerticalCenter)
            .attr("x",(bodyFatWidth * 11 / 16))
            .style("font-size","120px")
            .style("fill","#FF851B");

          article_bodyFat
          .append("h2")
            .text("Percent Body Fat - Current: "+ bodyFatPercentage + "% / Target: 12.0%");
        });

        // 1 Mile Time box
        var id_oneMileTime = "#Goal1MileTime"
        var width_oneMileTime = 400;

        var article_oneMileTime = addArticle(id_oneMileTime, width_oneMileTime);
        var svg_oneMileTime = article_oneMileTime
                .append("svg")
                .attr("width",width_oneMileTime)
                .attr("height",defaultSVGHeight);

        svg_runningMan = svg_oneMileTime
          .append("g")
          .attr("transform","translate(" + (width_oneMileTime / 16) + "," + (defaultSVGHeight/4) + ") scale(1)")
          .append("g");
        svg_runningMan
          .append("path")
          .attr("fill","#000000")
          .attr("d","M77.82,25.135c6.291-0.37,11.084-5.764,10.719-12.053c-0.37-6.286-5.762-11.088-12.056-10.719    C70.2,2.732,65.403,8.13,65.771,14.416C66.14,20.705,71.533,25.503,77.82,25.135z")
        svg_runningMan
          .append("path")
          .attr("d","M98.551,38.478c-1.094-2.39-3.913-3.443-6.304-2.349l-18.533,8.475l-2.537-16.023c-0.174-1.094-0.709-2.038-1.462-2.737    c-0.451-0.996-1.24-1.842-2.307-2.343l-20.466-9.63c-1.218-0.572-2.619-0.604-3.858-0.086c-1.241,0.516-2.206,1.534-2.653,2.8    l-6.78,19.132c-0.881,2.475,0.417,5.196,2.892,6.073c0.526,0.185,1.062,0.275,1.588,0.275c1.957,0,3.794-1.219,4.486-3.171    l5.024-14.178l7.247,3.41L39.101,48.186c-0.275,0.203-0.534,0.437-0.768,0.706L1.865,90.838c-1.724,1.983-1.513,4.986,0.468,6.711    c0.898,0.783,2.012,1.168,3.12,1.168c1.329,0,2.653-0.553,3.593-1.637l31.025-35.685L54.642,72.06L32.577,82.379    c-2.38,1.112-3.407,3.944-2.295,6.327c0.807,1.724,2.524,2.74,4.312,2.74c0.676,0,1.362-0.146,2.014-0.447l29.34-13.723    c1.526-0.713,2.559-2.176,2.723-3.849c0.162-1.673-0.569-3.307-1.927-4.299l-14.479-10.6l11.674-14.828l1.358,8.579    c0.232,1.471,1.139,2.747,2.449,3.449c0.702,0.374,1.474,0.564,2.251,0.564c0.671,0,1.347-0.144,1.976-0.431l24.23-11.082    C98.594,43.689,99.644,40.866,98.551,38.478z");
        svg_runningMan  
          .append("polygon")
          .attr("points","50,28 52,16 54,28");

        var mileTimeValue = "0:00"; 

        d3.json("./assets/json/1MileTimes.json", function(error, data) {
          if (error) throw error;
          mileTimeValue = data[0].Time;
          svg_oneMileTime
            .append("text")
              .text(mileTimeValue)
              .attr("y",defaultSVGVerticalCenter)
              .attr("x",width_oneMileTime * 5 / 8)
              .attr("text-anchor","middle")
              .attr("dominant-baseline", "central")
              .attr("text-anchor","middle")
              .style("font-size","120px")
              .style("fill","#3D9970");
          article_oneMileTime
            .append("h2")
            .text("1 Mile Time - Current: " + mileTimeValue + " / Target: 6:00");
        });

        // 10 Rep Bench Max Box
        var benchMaxId = "#Goal10RepBenchMax"
        var benchMaxValue = "145lbs";
        var width = d3
                    .select(benchMaxId)
                    .attr("data-width");
        d3
          .select(benchMaxId)
          .selectAll("svg")
          .attr("width",width)
          .attr("height",300)
        .append("g")
        .append("text")
          .text(benchMaxValue)
          .attr("text-anchor","middle")
          .attr("dominant-baseline", "central")
          .attr("y",defaultSVGVerticalCenter)
          .attr("x","280")
          .style("font-size","100px")
          .style("fill","#FF851B");

        // Free Throws
        var freeThrowsId = "#GoalFreeThrows";
        var freeThrowsValue;

        d3.json("./assets/json/Basketball.json", function(error, data) {
          if (error) throw error;

          freeThrowsValue = percent(data[1]["FreeThrowPercentage"]);

          d3
            .select(freeThrowsId)
          .append("svg")
            .attr("width",300)
            .attr("height",275)
          .append("text")
            .text(freeThrowsValue)
            .attr("text-anchor","middle")
            .attr("dominant-baseline", "central")
            .attr("y",defaultSVGVerticalCenter)
            .attr("x","150")
            .style("font-size","100px")
            .style("fill","#3D9970");

        });

        // Pull Ups
        var pullUpsId = "#GoalPullUps";
        var pullUpsValue = 10;
        d3
          .select(pullUpsId)
        .append("svg")
          .attr("width",300)
          .attr("height",275)
        .append("text")
          .text(pullUpsValue)
          .attr("text-anchor","middle")
          .attr("dominant-baseline", "central")
          .attr("y",defaultSVGVerticalCenter)
          .attr("x","150")
          .style("font-size","100px")
          .style("fill","#E82C0C");

    // var gaugeText = d3.select("#goal_pcf").append("text").text("These gauges will show my fitness goal progress.").attr("class","header");

    // TODO Multiple gauges
    // var gauge2 = d3.select("body").append("div").attr("class","chart-gauge");
    // var gauge3 = d3.select("body").append("div").attr("class","chart-gauge");

