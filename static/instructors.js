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

function fetchDataAndUpdateAngularChart() {

    fetch(`/get-instructor-percentage`)
        .then(response => response.json())
        .then(data => {
            updateAngularChart(data);
        })
        .catch(error => console.error('Error:', error));
}


function updateChart(data) {
    am5.array.each(am5.registry.rootElements,
        function (root) {
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

        legend.data.setAll([series3, series2, series4]);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear();
        chart.appear(1000, 100);

    });
}


function updateAngularChart(apidata) {
    <!-- Chart code -->
    am5.ready(function () {

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("angularchartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Dark.new(root)
        ]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/radar-chart/
        var chart = root.container.children.push(am5radar.RadarChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            innerRadius: am5.percent(20),
            startAngle: -90,
            endAngle: 180
        }));


// Data
        var data = [{
            category: "Computer Science",
            value: apidata[0],
            full: 100,
            columnSettings: {
                fill: chart.get("colors").getIndex(0)
            }
        }, {
            category: "Engineering",
            value: apidata[1],
            full: 100,
            columnSettings: {
                fill: chart.get("colors").getIndex(1)
            }
        }, {
            category: "Mathematics",
            value: apidata[2],
            full: 100,
            columnSettings: {
                fill: chart.get("colors").getIndex(2)
            }
        }, {
            category: "Science",
            value: apidata[3],
            full: 100,
            columnSettings: {
                fill: chart.get("colors").getIndex(3)
            }
        }];

// Add cursor
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
        var cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
            behavior: "zoomX"
        }));

        cursor.lineY.set("visible", false);

// Create axes and their renderers
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
        var xRenderer = am5radar.AxisRendererCircular.new(root, {
            //minGridDistance: 50
        });

        xRenderer.labels.template.setAll({
            radius: 10
        });

        xRenderer.grid.template.setAll({
            forceHidden: true
        });

        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            renderer: xRenderer,
            min: 0,
            max: 100,
            strictMinMax: true,
            numberFormat: "#'%'",
            tooltip: am5.Tooltip.new(root, {})
        }));


        var yRenderer = am5radar.AxisRendererRadial.new(root, {
            minGridDistance: 20
        });

        yRenderer.labels.template.setAll({
            centerX: am5.p100,
            fontWeight: "500",
            fontSize: 18,
            templateField: "columnSettings"
        });

        yRenderer.grid.template.setAll({
            forceHidden: true
        });

        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "category",
            renderer: yRenderer
        }));

        yAxis.data.setAll(data);


// Create series
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
        var series1 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            clustered: false,
            valueXField: "full",
            categoryYField: "category",
            fill: root.interfaceColors.get("alternativeBackground")
        }));

        series1.columns.template.setAll({
            width: am5.p100,
            fillOpacity: 0.08,
            strokeOpacity: 0,
            cornerRadius: 20
        });

        series1.data.setAll(data);


        var series2 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            clustered: false,
            valueXField: "value",
            categoryYField: "category"
        }));

        series2.columns.template.setAll({
            width: am5.p100,
            strokeOpacity: 0,
            tooltipText: "{category}: {valueX}%",
            cornerRadius: 20,
            templateField: "columnSettings"
        });

        series2.data.setAll(data);

// Animate chart and series in
// https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
        series1.appear(1000);
        series2.appear(1000);
        chart.appear(1000, 100);

    }); // end am5.ready()
}




document.addEventListener("DOMContentLoaded", function () {
    fetchDataAndUpdateChart();
    fetchDataAndUpdateAngularChart();
});


