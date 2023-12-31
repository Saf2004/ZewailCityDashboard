function fetchDataAndUpdateChart() {
    // Get the selected major and course
    var selectedMajor = document.getElementById('majors').value;
    var selectedCourse = document.getElementById('courses').value;

    // Fetch scores based on the selected major and course
    fetch(`/get-scores?major=${selectedMajor}&course=${selectedCourse}`)
        .then(response => response.json())
        .then(data => {
            updateChart(data);
        })
        .catch(error => console.error('Error:', error));
}

function updateChart(data) {
    am5.array.each(am5.registry.rootElements,
   function(root) {
      if (root.dom.id == "bulletchartdiv") {
         root.dispose();
      }
   }
);

    am5.ready(function () {

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("bulletchartdiv");


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
            layout: root.verticalLayout
        }));


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "instructor_name",
            renderer: am5xy.AxisRendererY.new(root, {
                cellStartLocation: 0.1,
                cellEndLocation: 0.9
            }),
            tooltip: am5.Tooltip.new(root, {})
        }));

        yAxis.data.setAll(data);

        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {
                minGridDistance: 40
            })
        }));

        xAxis.get("renderer").grid.template.set("visible", false);


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            openValueXField: "minimum_score",
            valueXField: "maximum_score",
            categoryYField: "instructor_name",
            fill: am5.color(0x888888)
        }));

        series.columns.template.setAll({
            height: 5
        });

        series.data.setAll(data);

// Add bullets
        series.bullets.push(function () {
            return am5.Bullet.new(root, {
                locationX: 0,
                sprite: am5.Circle.new(root, {
                    fill: am5.color(0x009dd9),
                    radius: 10
                })
            });
        });

        series.bullets.push(function () {
            return am5.Bullet.new(root, {
                locationX: 1,
                sprite: am5.Circle.new(root, {
                    fill: am5.color(0x009dd9),
                    radius: 10
                })
            });
        });


        var series2 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Average Score",
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: "average",
            categoryYField: "instructor_name"
        }));

        series2.strokes.template.setAll({
            visible: false
        });

        series2.data.setAll(data);

// Add bullets
        series2.bullets.push(function () {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    fill: am5.color(0x70b603),
                    rotation: 180,
                    width: 24,
                    height: 24
                })
            });
        });


        var series3 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Minimum Score / Maximum Score",
            xAxis: xAxis,
            yAxis: yAxis,
            // valueXField: "average",
            // categoryYField: "instructor_name"
        }));

        series3.strokes.template.setAll({
            visible: false
        });

        series3.data.setAll(data);

// Add bullets
        series3.bullets.push(function () {
            return am5.Bullet.new(root, {
                locationX: 0,
                sprite: am5.Circle.new(root, {
                    fill: am5.color(0x009dd9),
                    radius: 10
                })
            });
        });

        var series4 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Actual Score",
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: "actual",
            categoryYField: "instructor_name",
            tooltip: am5.Tooltip.new(root, {
                labelText: "Student Count: {valueY}"
            })
        }));

        series4.strokes.template.setAll({
            visible: false
        });

        series4.data.setAll(data);

        // Add bullets
        series4.bullets.push(function () {
            return am5.Bullet.new(root, {
                locationX: 1,
                sprite: am5.Circle.new(root, {
                    fill: am5.color(0xff2c2c),
                    radius: 10
                })
            });
        });


// Add legend
        var legend = chart.children.push(am5.Legend.new(root, {
            layout: root.horizontalLayout,
            clickTarget: "none"
        }));

        legend.data.setAll([series3, series2,series4]);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear();
        chart.appear(1000, 100);

    });
}

document.addEventListener("DOMContentLoaded" ,function(){
    fetchDataAndUpdateChart();

});

