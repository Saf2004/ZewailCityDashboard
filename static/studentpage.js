function fetchDataAndUpdateStackedBarChart() {
    fetch('/get-major-enrollment')
        .then(response => response.json())
        .then(data => {
            updateStackedChart(data);
        })
        .catch(error => console.error('Error:', error));
}
function fetchDataAndUpdateBarChart1() {
    fetch('/get-cs-gpa')
        .then(response => response.json())
        .then(data => {
            updateChart(data, "barchartdivcs");
        })
        .catch(error => console.error('Error:', error));
}

function fetchDataAndUpdateBarChart2() {
    fetch('/get-eng-gpa')
        .then(response => response.json())
        .then(data => {
            updateChart(data, "barchartdiveng");
        })
        .catch(error => console.error('Error:', error));
}

function fetchDataAndUpdateBarChart3() {
    fetch('/get-math-gpa')
        .then(response => response.json())
        .then(data => {
            updateChart(data, "barchartdivmath");
        })
        .catch(error => console.error('Error:', error));
}

function fetchDataAndUpdateBarChart4() {
    fetch('/get-sc-gpa')
        .then(response => response.json())
        .then(data => {
            updateChart(data, "barchartdivsc");
        })
        .catch(error => console.error('Error:', error));
}

function fetchDataAndUpdateBarChart() {
    fetch('/get-mean-grades')
        .then(response => response.json())
        .then(data => {
            updateBarChart(data);
        })
        .catch(error => console.error('Error:', error));
}

function fetchDataAndUpdatePieChart() {
    fetch('/get-students-count')
        .then(response => response.json())
        .then(data => {
            updatePieChart(data);
        })
        .catch(error => console.error('Error:', error));
}

function updateChart(apidata, chartname) {
    am5.ready(function () {

// Create root element
        var root = am5.Root.new(chartname);

// Set themes
        root.setThemes([
            am5themes_Dark.new(root)
        ]);

// Create chart
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true,
            paddingLeft: 0,
            paddingRight: 1
        }));

// Add cursor
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);


// Create axes
        var xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 30,
            minorGridEnabled: true
        });

        xRenderer.labels.template.setAll({
            rotation: -90,
            centerY: am5.p50,
            centerX: am5.p100,
            paddingRight: 15
        });

        xRenderer.grid.template.setAll({
            location: 1
        })

        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            maxDeviation: 0.3,
            categoryField: "GPA",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {})
        }));

        var yRenderer = am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.1
        })

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0.3,
            renderer: yRenderer
        }));

// Create series
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: "Series 1",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            sequencedInterpolation: true,
            categoryXField: "GPA",
            tooltip: am5.Tooltip.new(root, {
                labelText: "Student Count: {valueY}"
            })
        }));

        series.columns.template.setAll({cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0});
        series.columns.template.adapters.add("fill", function (fill, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        series.columns.template.adapters.add("stroke", function (stroke, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });


// Set data
        xAxis.data.setAll(apidata);
        series.data.setAll(apidata);


        series.appear(1000);
        chart.appear(1000, 100);

    });
}

function updateBarChart(data) {
    am5.ready(function () {


// Create root element

        var root = am5.Root.new("chartdiv");


// Set themes

        root.setThemes([
            am5themes_Dark.new(root)
        ]);


// Create chart

        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            paddingLeft: 0,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout
        }));


// Add legend

        var legend = chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50
            })
        );


// Create axes
        var xRenderer = am5xy.AxisRendererX.new(root, {
            cellStartLocation: 0.1,
            cellEndLocation: 0.9,
            minorGridEnabled: true
        })

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
            renderer: am5xy.AxisRendererY.new(root, {
                strokeOpacity: 0.1
            })
        }));


// Add series
        function makeSeries(name, fieldName) {
            var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: fieldName,
                categoryXField: "year"
            }));

            series.columns.template.setAll({
                tooltipText: "{name} Average, {categoryX}: {valueY}",
                width: am5.percent(90),
                tooltipY: 0,
                strokeOpacity: 0
            });

            series.data.setAll(data);

            // Make stuff animate on load
            series.appear();

            series.bullets.push(function () {
                return am5.Bullet.new(root, {
                    locationY: 0,
                    sprite: am5.Label.new(root, {
                        text: "{valueY}",
                        fill: root.interfaceColors.get("alternativeText"),
                        centerY: 0,
                        centerX: am5.p50,
                        populateText: true
                    })
                });
            });

            legend.data.push(series);
        }

        makeSeries("Computer Science", "computer science");
        makeSeries("Engineering", "engineering");
        makeSeries("Mathematics", "mathematics");
        makeSeries("Science", "science");


// Make stuff animate on load
        chart.appear(1000, 100);

    });
}

function updatePieChart(data) {
    am5.ready(function () {

// Create root element
        var root = am5.Root.new("piechartdiv");


// Set themes
        root.setThemes([
            am5themes_Dark.new(root)
        ]);


// Create chart
        var chart = root.container.children.push(am5percent.PieChart.new(root, {
            layout: root.verticalLayout
        }));


// Create series
        var series = chart.series.push(am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "major",
            alignLabels: false,

        }));
        series.labels.template.setAll({
            text: "{category}",
            textType: "circular",
            textSize: 5,
            inside: true,
            radius: 10
        });

// Set data
        series.data.setAll(data);


// Play initial series animation
        series.appear(1000, 100);
    });
}


function updateStackedChart(apidata) {
    am5.ready(function () {
        var root = am5.Root.new("linechartdiv");


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
            layout: root.verticalLayout
        }));


// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        var legend = chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50
            })
        );


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            min: 2020,
            max: 2024,
            renderer: am5xy.AxisRendererX.new(root, {})
        }));

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            min: 0,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        function createSeries(name, data) {
            var series = chart.series.push(am5xy.StepLineSeries.new(root, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                baseAxis: xAxis,
                valueYField: "ay",
                valueXField: "ax",
                stacked: true
            }));

            series.strokes.template.setAll({
                strokeWidth: 3
            });

            series.fills.template.setAll({
                fillOpacity: 0.2,
                visible: true
            });

            series.data.setAll(data);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            series.appear();

            var bulletSeries = chart.series.push(am5xy.ColumnSeries.new(root, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                baseAxis: xAxis,
                valueYField: "ay",
                valueXField: "ax",
                stacked: true
            }));

            bulletSeries.columns.template.setAll({
                //width: 50,
                forceHidden: true
            });

            var bulletSeriesData = [];
            for (var i = 1; i < data.length; i++) {
                bulletSeriesData.push({
                    "ax": data[i].ax - (data[i].ax - data[i - 1].ax) / 2,
                    "ay": data[i - 1].ay
                })
            }

            bulletSeries.data.setAll(bulletSeriesData);

            bulletSeries.bullets.push(function () {
                return am5.Bullet.new(root, {
                    locationX: 0.5,
                    locationY: 0.5,
                    sprite: am5.Label.new(root, {
                        text: "{valueY}",
                        centerY: am5.p50,
                        centerX: am5.p50,
                        populateText: true,
                        background: am5.RoundedRectangle.new(root, {
                            fill: root.interfaceColors.get("background")
                        })
                    })
                });
            });

            series.on("visible", function (visible, series) {
                if (visible) {
                    bulletSeries.show();
                } else {
                    bulletSeries.hide();
                }
            })

            legend.data.push(series);
        }


        createSeries("Computer Science", apidata["Computer Science"])
        createSeries("Engineering", apidata["Engineering"])
        createSeries("Mathematics", apidata["Mathematics"])
        createSeries("Science", apidata["Science"])


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);

    }); // end am5.ready()
}


document.addEventListener('DOMContentLoaded', function () {
    fetchDataAndUpdateBarChart1();
    fetchDataAndUpdateBarChart2();
    fetchDataAndUpdateBarChart3();
    fetchDataAndUpdateBarChart4();
    fetchDataAndUpdateBarChart();
    fetchDataAndUpdatePieChart();
    fetchDataAndUpdateStackedBarChart();
});

