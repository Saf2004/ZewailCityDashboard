function fetchDataAndUpdateChart() {
    fetch('/get-majors-fees')
        .then(response => response.json())
        .then(data => {
            updateChart(data);
        })
        .catch(error => console.error('Error:', error));
}
function fetchDataAndUpdateLayeredChart() {
    fetch('/get-students-cost')
        .then(response => response.json())
        .then(data => {
            updateLayeredChart(data);
            console.log(data)
        })
        .catch(error => console.error('Error:', error));
}
function fetchDataAndUpdateStackChart() {
    fetch('/get-scholarship-percentage')
        .then(response => response.json())
        .then(data => {
            updateStackChart(data);
        })
        .catch(error => console.error('Error:', error));
}

function updateChart(data) {
    am5.ready(function () {

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("stackedchartdiv");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Dark.new(root)
        ]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            layout: root.horizontalLayout,
            paddingLeft: 0
        }));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        var legendData = [];
        var legend = chart.children.push(
            am5.Legend.new(root, {
                nameField: "name",
                fillField: "color",
                strokeField: "color",
                //centerY: am5.p50,
                marginLeft: 20,
                y: 20,
                layout: root.verticalLayout,
                clickTarget: "none"
            })
        );

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "year",
            renderer: am5xy.AxisRendererY.new(root, {
                minGridDistance: 10,
                minorGridEnabled: true
            }),
            tooltip: am5.Tooltip.new(root, {})
        }));

        yAxis.get("renderer").labels.template.setAll({
            fontSize: 12,
            location: 0.5
        })

        yAxis.data.setAll(data);

        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {}),
            tooltip: am5.Tooltip.new(root, {})
        }));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: "fees",
            categoryYField: "year",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal"
            })
        }));

        series.columns.template.setAll({
            tooltipText: "{categoryY}: [bold]{valueX}[/]",
            width: am5.percent(90),
            strokeOpacity: 0
        });

        series.columns.template.adapters.add("fill", function (fill, target) {
            if (target.dataItem) {
                switch (target.dataItem.dataContext.major) {
                    case "Computer Science":
                        return chart.get("colors").getIndex(0);
                        break;
                    case "Engineering":
                        return chart.get("colors").getIndex(1);
                        break;
                    case "Mathematics":
                        return chart.get("colors").getIndex(2);
                        break;
                    case "Science":
                        return chart.get("colors").getIndex(3);
                        break;
                }
            }
            return fill;
        })


        series.data.setAll(data);

        function createRange(label, category, color) {
            var rangeDataItem = yAxis.makeDataItem({
                category: category
            });

            var range = yAxis.createAxisRange(rangeDataItem);

            rangeDataItem.get("label").setAll({
                fill: color,
                text: label,
                location: 1,
                fontWeight: "bold",
                dx: -130
            });

            rangeDataItem.get("grid").setAll({
                stroke: color,
                strokeOpacity: 1,
                location: 1
            });

            rangeDataItem.get("tick").setAll({
                stroke: color,
                strokeOpacity: 1,
                location: 1,
                visible: true,
                length: 130
            });

            legendData.push({name: label, color: color});

        }

        createRange("Computer Science", "2024 Computer Science", chart.get("colors").getIndex(0));
        createRange("Engineering", "2024 Engineering", chart.get("colors").getIndex(1));
        createRange("Mathematics", "2024 Mathematics", chart.get("colors").getIndex(2));
        createRange("Science", "2024 Science", chart.get("colors").getIndex(3));

        legend.data.setAll(legendData);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            xAxis: xAxis,
            yAxis: yAxis
        }));


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear();
        chart.appear(1000, 100);

    });
}

function updateLayeredChart(apidata) {
   am5.ready(function() {

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("layeredchartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Dark.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
var chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: true,
  panY: false,
  wheelX: "panX",
  wheelY: "zoomX",
  paddingLeft: 0,
  layout: root.verticalLayout
}));

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

var data = apidata

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var xRenderer = am5xy.AxisRendererX.new(root, {
  minGridDistance: 70,
  minorGridEnabled: true
});
xRenderer.labels.template.setAll({
            rotation: -90,
            centerY: am5.p50,
            centerX: am5.p100,
            paddingRight: 15
        });

var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "country",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {
    themeTags: ["axis"],
    animationDuration: 200
  })
}));

xRenderer.grid.template.setAll({
  location: 1
})

xAxis.data.setAll(data);

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  min: 0,
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/

var series0 = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: "Income",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "year2004",
  categoryXField: "country",
  clustered: false,
  tooltip: am5.Tooltip.new(root, {
    labelText: "Fees Before Discount: {valueY}"
  })
}));

series0.columns.template.setAll({
  width: am5.percent(80),
  tooltipY: 0,
  strokeOpacity: 0
});


series0.data.setAll(data);


var series1 = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: "Income",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "year2005",
  categoryXField: "country",
  clustered: false,
  tooltip: am5.Tooltip.new(root, {
    labelText: "Fees After Discount: {valueY}"
  })
}));

series1.columns.template.setAll({
  width: am5.percent(50),
  tooltipY: 0,
  strokeOpacity: 0
});

series1.data.setAll(data);

var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
series0.appear();
series1.appear();

}); // end am5.ready()am5.ready()
}

function updateStackChart(data) {
  am5.ready(function () {


// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("stackbarchartdiv");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Dark.new(root)
    ]);


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft: 0,
      layout: root.verticalLayout
    }));

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true
    });
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "year",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    xRenderer.grid.template.setAll({
      location: 1
    })

    xAxis.data.setAll(data);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      max: 100,
      numberFormat: "#'%'",
      strictMinMax: true,
      calculateTotals: true,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })
    }));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name, fieldName) {
      var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        stacked: true,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        valueYShow: "valueYTotalPercent",
        categoryXField: "year"
      }));

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}:{valueYTotalPercent.formatNumber('#.#')}%",
        tooltipY: am5.percent(10)
      });
      series.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueYTotalPercent.formatNumber('#.#')}%",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true
          })
        });
      });

      legend.data.push(series);
    }

    makeSeries("Computer Science", "Computer Science");
    makeSeries("Engineering", "Engineering");
    makeSeries("Mathematics", "Mathematics");
    makeSeries("Science", "Science");

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);

  }); // end am5.ready()
}


document.addEventListener("DOMContentLoaded", function () {
        fetchDataAndUpdateChart();
        fetchDataAndUpdateLayeredChart();
        fetchDataAndUpdateStackChart();
    }
);