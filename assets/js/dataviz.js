    var width = 500,
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

      rect
          .filter(function(d) { return d in nest; })
          .transition()
          .delay(1200)
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
          // TODO Find place for this in json
          // var targetBodyFat = percent(data[0]["Target"]);
          var targetBodyFat = percent(.12);
          var initialBodyFat = percent(data[0]["Percent Body Fat"]);
          var mostRecentIndex = data.length - 1;
          var bodyFatPercentage = percent(data[mostRecentIndex]["Percent Body Fat"]);

          svg_bodyFat
          .append("text")
            .text("Initial:     " + initialBodyFat)
            .attr("y",defaultSVGHeight * 2 / 5)
            .attr("x",(bodyFatWidth * 5 / 16))
            .style("font-size","40px")
            .style("fill","#E82C0C");

          svg_bodyFat
          .append("text")
            .text("Current: " + bodyFatPercentage)
            .attr("y",defaultSVGHeight * 3 / 5)
            .attr("x",(bodyFatWidth * 5 / 16))
            .style("font-size","40px")
            .style("fill","#FF851B");

          svg_bodyFat
          .append("text")
            .text("Target: " + targetBodyFat)
            .attr("y",defaultSVGHeight * 4 / 5)
            .attr("x",(bodyFatWidth * 5 / 16))
            .style("font-size","40px")
            .style("fill","#3D9970");

          article_bodyFat
          .append("h2")
            .text("Percent Body Fat");
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
            .text("1 Mile Time - Current: " + mileTimeValue + " / Target: 6:40");
        });

        // 10 Rep Bench Max Box
        var id_benchMax = "#Goal1MileTime";
        var value_benchMax = 150;
        var units_benchMax = "lbs";
        var width_benchMax = 400;

        var article_benchMax = addArticle(id_benchMax, width_benchMax);
        var svg_benchMax = article_benchMax
                .append("svg")
                .attr("width",width_benchMax)
                .attr("height",defaultSVGHeight);

        svg_arm1 = svg_benchMax
          .append("g")
          .attr("transform","translate(" + (width_benchMax / 64) + "," + (defaultSVGHeight * 1 / 8)+ 35 + ") scale(1)")
          .append("g");
        svg_arm1
          .append("path")
          .attr("fill","#000000")
          .attr("d","M60.044,19.257c-0.005-0.003-0.01-0.005-0.015-0.008c-0.002,0.004-0.004,0.008-0.006,0.012   C60.029,19.26,60.037,19.259,60.044,19.257z")
        svg_arm1
          .append("path")
          .attr("d","M71.904,45.784c-2.846,1.382-4.373,3.146-7.176,4.547c-1.819,0.91-5.136,0-8.268-0.504   c-3.135-0.505-8.606-0.304-11.544,4.952c-2.544,4.555-1.402,1.821-1.402,1.821s-1.111-11.067-1.313-12.358   C42,42.953,43.881,28.196,45.417,27.388c1.536-0.809,5.174-0.102,7.431-1.247c2.258-1.145,5.223-1.954,5.223-1.954   s0.91,0.505,1.685,0.168c0.775-0.337,2.021-1.213,2.392-1.381c0.372-0.168,1.06-1.246,0.784-1.954   c-0.279-0.708-1.491-1.92-2.47-1.82c-0.196,0.021-0.323,0.04-0.417,0.056c0.012,0.01,0.027,0.011,0.037,0.024   c0.049,0.068,0.033,0.163-0.035,0.211c-0.022,0.017-2.261,1.644-1.86,3.208c0.021,0.082-0.027,0.164-0.108,0.185   c-0.013,0.003-0.025,0.004-0.038,0.004c-0.067,0-0.129-0.045-0.147-0.114c-0.451-1.765,1.879-3.459,1.978-3.53   c0.052-0.037,0.111-0.027,0.16,0.003c0.198-0.33,0.751-1.317,0.669-1.902c-0.103-0.707-1.213-2.796-2.189-3.908   s-2.965-3.773-4.279-3.672c-1.315,0.101-1.28,0.236-1.28,0.236s-1.012-1.482-2.393-0.842c-1.38,0.64-1.853,1.247-1.853,1.247   s-2.459,1.111-3.065,1.887c-0.606,0.775-2.628,1.55-3.135,2.358c-0.504,0.809-3.098,2.864-3.94,4.211   c-0.843,1.348-2.292,3.302-2.864,4.078c-0.572,0.774-0.708,2.223-0.91,2.998c-0.202,0.775-3.435,11.118-4.244,12.331   c-0.808,1.213-5.728,11.186-6.369,12.667c-0.639,1.482-0.572,4.245-0.976,5.29c-0.405,1.044-0.606,4.952-0.134,7.176   c0.472,2.225,0.202,4.649-0.034,5.492s-2.257,3.942,0.741,6.368c2.997,2.425,4.885,3.975,7.514,3.875   c2.627-0.102,17.99,0.303,20.147,0.167c2.155-0.134,7.108-0.707,9.769-2.358c2.662-1.65,8.627-4.75,10.108-4.582   c0,0,2.392,5.829,3.538,7.177c1.146,1.348,2.088,1.583,2.088,1.583h6.737l-0.138-36.062C83.536,45.062,79.527,42.079,71.904,45.784   z M53.778,11.705c0.066-0.053,0.16-0.043,0.213,0.022c0.198,0.244,4.845,6.003,4.123,8.377c-0.422,1.391-1.727,3.344-1.783,3.426   c-0.028,0.044-0.076,0.067-0.125,0.067c-0.029,0-0.06-0.008-0.086-0.025c-0.068-0.047-0.087-0.141-0.04-0.211   c0.013-0.02,1.335-1.999,1.744-3.345c0.675-2.223-4.021-8.04-4.068-8.098C53.704,11.853,53.714,11.757,53.778,11.705z    M51.654,14.003c0.079-0.025,0.163,0.016,0.19,0.092c0.014,0.034,0.083,0.173,0.191,0.393c2.254,4.548,3.154,6.952,2.833,7.563   c-0.514,0.976-2.529,2.655-2.616,2.726c-0.027,0.023-0.062,0.035-0.096,0.035c-0.045,0-0.088-0.019-0.117-0.055   c-0.054-0.064-0.045-0.16,0.021-0.213c0.02-0.017,2.055-1.71,2.539-2.634c0.149-0.283-0.021-1.606-2.835-7.287   c-0.166-0.337-0.196-0.399-0.206-0.428C51.532,14.114,51.575,14.029,51.654,14.003z M48.205,16.116   c0.057-0.062,0.152-0.065,0.214-0.008c0.79,0.736,2.333,5.19,2.117,6.109c-0.198,0.84-1.684,2.331-2.076,2.552   c-0.038,0.021-0.085,0.043-0.137,0.043c-0.018,0-0.036-0.002-0.055-0.009c-0.08-0.026-0.123-0.112-0.097-0.191   c0.02-0.062,0.074-0.101,0.135-0.104c0.249-0.121,1.75-1.578,1.934-2.36c0.191-0.813-1.326-5.163-2.029-5.818   C48.151,16.273,48.147,16.177,48.205,16.116z");


        svg_arm2 = svg_benchMax
          .append("g")
          .attr("transform","translate(" + (width_benchMax * 65 / 64) + "," + (defaultSVGHeight * 1 / 8) + 35 + ") scale(-1,1)")
          .append("g");
        svg_arm2
          .append("path")
          .attr("fill","#000000")
          .attr("d","M60.044,19.257c-0.005-0.003-0.01-0.005-0.015-0.008c-0.002,0.004-0.004,0.008-0.006,0.012   C60.029,19.26,60.037,19.259,60.044,19.257z")
        svg_arm2
          .append("path")
          .attr("d","M71.904,45.784c-2.846,1.382-4.373,3.146-7.176,4.547c-1.819,0.91-5.136,0-8.268-0.504   c-3.135-0.505-8.606-0.304-11.544,4.952c-2.544,4.555-1.402,1.821-1.402,1.821s-1.111-11.067-1.313-12.358   C42,42.953,43.881,28.196,45.417,27.388c1.536-0.809,5.174-0.102,7.431-1.247c2.258-1.145,5.223-1.954,5.223-1.954   s0.91,0.505,1.685,0.168c0.775-0.337,2.021-1.213,2.392-1.381c0.372-0.168,1.06-1.246,0.784-1.954   c-0.279-0.708-1.491-1.92-2.47-1.82c-0.196,0.021-0.323,0.04-0.417,0.056c0.012,0.01,0.027,0.011,0.037,0.024   c0.049,0.068,0.033,0.163-0.035,0.211c-0.022,0.017-2.261,1.644-1.86,3.208c0.021,0.082-0.027,0.164-0.108,0.185   c-0.013,0.003-0.025,0.004-0.038,0.004c-0.067,0-0.129-0.045-0.147-0.114c-0.451-1.765,1.879-3.459,1.978-3.53   c0.052-0.037,0.111-0.027,0.16,0.003c0.198-0.33,0.751-1.317,0.669-1.902c-0.103-0.707-1.213-2.796-2.189-3.908   s-2.965-3.773-4.279-3.672c-1.315,0.101-1.28,0.236-1.28,0.236s-1.012-1.482-2.393-0.842c-1.38,0.64-1.853,1.247-1.853,1.247   s-2.459,1.111-3.065,1.887c-0.606,0.775-2.628,1.55-3.135,2.358c-0.504,0.809-3.098,2.864-3.94,4.211   c-0.843,1.348-2.292,3.302-2.864,4.078c-0.572,0.774-0.708,2.223-0.91,2.998c-0.202,0.775-3.435,11.118-4.244,12.331   c-0.808,1.213-5.728,11.186-6.369,12.667c-0.639,1.482-0.572,4.245-0.976,5.29c-0.405,1.044-0.606,4.952-0.134,7.176   c0.472,2.225,0.202,4.649-0.034,5.492s-2.257,3.942,0.741,6.368c2.997,2.425,4.885,3.975,7.514,3.875   c2.627-0.102,17.99,0.303,20.147,0.167c2.155-0.134,7.108-0.707,9.769-2.358c2.662-1.65,8.627-4.75,10.108-4.582   c0,0,2.392,5.829,3.538,7.177c1.146,1.348,2.088,1.583,2.088,1.583h6.737l-0.138-36.062C83.536,45.062,79.527,42.079,71.904,45.784   z M53.778,11.705c0.066-0.053,0.16-0.043,0.213,0.022c0.198,0.244,4.845,6.003,4.123,8.377c-0.422,1.391-1.727,3.344-1.783,3.426   c-0.028,0.044-0.076,0.067-0.125,0.067c-0.029,0-0.06-0.008-0.086-0.025c-0.068-0.047-0.087-0.141-0.04-0.211   c0.013-0.02,1.335-1.999,1.744-3.345c0.675-2.223-4.021-8.04-4.068-8.098C53.704,11.853,53.714,11.757,53.778,11.705z    M51.654,14.003c0.079-0.025,0.163,0.016,0.19,0.092c0.014,0.034,0.083,0.173,0.191,0.393c2.254,4.548,3.154,6.952,2.833,7.563   c-0.514,0.976-2.529,2.655-2.616,2.726c-0.027,0.023-0.062,0.035-0.096,0.035c-0.045,0-0.088-0.019-0.117-0.055   c-0.054-0.064-0.045-0.16,0.021-0.213c0.02-0.017,2.055-1.71,2.539-2.634c0.149-0.283-0.021-1.606-2.835-7.287   c-0.166-0.337-0.196-0.399-0.206-0.428C51.532,14.114,51.575,14.029,51.654,14.003z M48.205,16.116   c0.057-0.062,0.152-0.065,0.214-0.008c0.79,0.736,2.333,5.19,2.117,6.109c-0.198,0.84-1.684,2.331-2.076,2.552   c-0.038,0.021-0.085,0.043-0.137,0.043c-0.018,0-0.036-0.002-0.055-0.009c-0.08-0.026-0.123-0.112-0.097-0.191   c0.02-0.062,0.074-0.101,0.135-0.104c0.249-0.121,1.75-1.578,1.934-2.36c0.191-0.813-1.326-5.163-2.029-5.818   C48.151,16.273,48.147,16.177,48.205,16.116z");


          svg_benchMax
            .append("text")
              .text(value_benchMax + units_benchMax)
              .attr("y",defaultSVGVerticalCenter)
              .attr("x",width_benchMax / 2 + 5)
              .attr("text-anchor","middle")
              .attr("dominant-baseline", "central")
              .attr("text-anchor","middle")
              .style("font-size","80px")
              .style("fill","#FF851B");
          article_benchMax
            .append("h2")
            .text("10-Rep Bench Max Weight - Current: " + value_benchMax + units_benchMax + " / Target: 185");


        // Free Throws
        var id_freeThrows = "#GoalFreeThrows";
        var width_freeThrows = 350;
        var freeThrowsValue;

        var article_freeThrows= addArticle(id_freeThrows, width_freeThrows);
        var svg_freeThrows= article_freeThrows
                .append("svg")
                .attr("width",width_freeThrows)
                .attr("height",defaultSVGHeight);

        svg_hoop = svg_freeThrows
          .append("g")
          .attr("transform","translate(" + (width_freeThrows * 3 / 8) + "," + (defaultSVGHeight/32) + ") scale(1)")
          .append("g");
        svg_hoop
          .append("path")
          .attr("fill","#000000")
          .attr("d","M100,72.945V10.277H0v62.668h37.676l0.321,3.64c0,0.004,0,0.009,0.001,0.013l1.115,12.609  c0.021,0.234,0.184,0.432,0.41,0.495s0.467-0.021,0.606-0.208l3.259-4.389l3.237,4.014c0.214,0.268,0.666,0.268,0.879,0l3.256-4.036  l3.256,4.036c0.215,0.268,0.664,0.268,0.879,0l3.236-4.014l3.26,4.389c0.108,0.146,0.278,0.229,0.453,0.229  c0.051,0,0.104-0.007,0.153-0.021c0.228-0.063,0.39-0.261,0.41-0.495l1.112-12.609c0.002-0.005,0.002-0.009,0.002-0.013l0.321-3.64  H100z M3.389,69.559V13.666h93.222v55.893H64.146l0.33-3.744H75.12V28.76H25.617v37.054h11.429l0.331,3.744H3.389z M58.238,82.986  l-2.813-6.313l3.8-7.094l3.101,6.926L58.238,82.986z M50.762,82.986l-3.408-6.358l3.408-7.646l3.406,7.646L50.762,82.986z   M43.285,82.986L39.2,76.505l3.098-6.925l3.8,7.094L43.285,82.986z M45.189,60.352l-2.982,6.666l-3.571-6.666H45.189z   M53.369,60.352l-2.607,5.854l-2.609-5.854H53.369z M62.887,60.352l-3.57,6.666l-2.982-6.666H62.887z M64.959,60.352h0.094  c0.949,0,1.719-0.771,1.719-1.719c0-0.947-0.77-1.719-1.719-1.719H35.684c-0.949,0-1.719,0.771-1.719,1.719  c0,0.948,0.77,1.719,1.719,1.719h0.879l0.183,2.074h-7.741V32.148H71.73v30.277h-6.955L64.959,60.352z M37.765,61.119l3.858,7.201  l-2.69,6.014L37.765,61.119z M42.881,68.275l3.545-7.924h0.49l3.227,7.242l-3.463,7.772L42.881,68.275z M51.38,67.594l3.228-7.242  h0.488l3.547,7.926l-3.8,7.091L51.38,67.594z M59.898,68.32l3.858-7.203L62.59,74.336L59.898,68.32z M40.108,87.629l-0.778-8.797  l3.356,5.324L40.108,87.629z M47.066,87.865l-3.039-3.77l2.746-6.162l3.314,6.187L47.066,87.865z M54.456,87.865l-3.021-3.746  l3.313-6.186l2.745,6.162L54.456,87.865z M61.415,87.629l-2.579-3.473l3.355-5.324L61.415,87.629z")
        
        d3.json("./assets/json/Basketball.json", function(error, data) {
          if (error) throw error;

          var mostRecentIndex = data.length - 1;
          freeThrowsValue = percent(data[mostRecentIndex]["Hit"] / data[mostRecentIndex]["Total"]);
          freeThrowsTarget = percent(data[0]["Target"]);

          svg_freeThrows
          .append("text")
            .text(freeThrowsValue)
            .attr("text-anchor","middle")
            .attr("dominant-baseline", "central")
            .attr("y",defaultSVGHeight * 3 / 4)
            .attr("x",width_freeThrows / 2)
            .style("font-size","100px")
            .style("fill","#3D9970");

          article_freeThrows
            .append("h2")
            .text("Free Throw % - Current: " + freeThrowsValue + " / Target: " + freeThrowsTarget);

        });




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


        // Pull Ups
        var id_pullUps = "#GoalPullUps";
        var width_pullUps = 300;
        var pullUpsValue = 10;
        var pullUpsManX = (width_pullUps / 32);
        var pullUpsManY = -12
        var article_pullUps = addArticle(id_pullUps, width_pullUps);
        var svg_pullUps = article_pullUps
                .append("svg")
                .attr("width",width_pullUps)
                .attr("height",defaultSVGHeight);

        svg_pullUpsMan = svg_pullUps
          .append("g")
          .attr("transform","translate(" + pullUpsManX + "," + pullUpsManY + ") scale(1.5)")
        svg_pullUpsMan
          .append("path")
          .attr("fill","#000000")
          .attr("d","M56.532,18.235c0,4.119-3.34,7.457-7.458,7.457c-4.117,0-7.456-3.338-7.456-7.457c0-4.121,3.338-7.458,7.456-7.458  C53.192,10.776,56.532,14.116,56.532,18.235z M81.879,6.438c0,0.492-0.399,0.891-0.892,0.891H65.182  c0.265,5.255,0.891,19.781,0.02,25.147c-1.069,6.61-5.648,7.239-5.648,7.239s-0.276,0.07-0.786,0.173v24.108l-1.402,11.256  l5.889,12.875c0,0,1.061,4.223-2.545,5.603c-3.603,1.381-5.178-1.329-5.178-1.329l-7.179-15.695l-0.037-0.004l0.007-0.06  l-0.007-0.016l0.01-0.004l1.574-12.626H47.65l-1.678,13.462l5.891,12.875c0,0,1.059,4.222-2.546,5.601  c-3.603,1.383-5.177-1.327-5.177-1.327l-7.18-15.695l-0.037-0.004l0.007-0.061l-0.007-0.015l0.01-0.006l1.849-14.83l-0.159-24.062  V39.34c-0.005-0.001-0.027-0.007-0.027-0.007s-4.579-0.632-5.649-7.239c-0.851-5.245-0.273-19.226,0.001-24.765H17.16  c-0.492,0-0.891-0.399-0.891-0.891c0-0.493,0.399-0.892,0.891-0.892h15.88c0.019-0.342,0.03-0.531,0.03-0.531  s0.376-1.824,3.19-2.368c2.815-0.532,3.412,2.279,3.412,2.279l-0.003,0.62h18.807l-0.001-0.235c0,0,0.599-2.812,3.412-2.279  c2.815,0.543,3.19,2.367,3.19,2.367s0.003,0.06,0.009,0.147h15.9C81.479,5.547,81.879,5.946,81.879,6.438z M56.041,27.474  l0.538,0.061c0.653,0.068,1.323,0.147,2,0.232L58.484,7.33H39.662l-0.093,20.211l0.307,0.001  C43.248,27.128,48.84,26.766,56.041,27.474z")

          svg_pullUps
            .append("text")
              .text(pullUpsValue)
              .attr("y",defaultSVGVerticalCenter)
              .attr("x",width_pullUps * 5 / 8)
              .attr("text-anchor","middle")
              .attr("dominant-baseline", "central")
              .attr("text-anchor","middle")
              .style("font-size","120px")
              .style("fill","#E82C0C");
          article_pullUps
            .append("h2")
            .text("Pull Ups - Current: " + pullUpsValue + " / Target: 20");

(function repeat() {
        svg_pullUpsMan
            .transition()
            .duration(1200)
            .delay(5000)
            .attr("transform","translate(" + pullUpsManX + "," + (pullUpsManY - 30) + ") scale(1.5)")
            .transition()
            .attr("transform","translate(" + pullUpsManX + "," + (pullUpsManY) + ") scale(1.5)")
            .each("end", repeat);
  })();


          article_nextGoal = addArticle("",300);
          article_nextGoal.append("h2").text("Next Goal...");
