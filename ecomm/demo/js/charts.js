var Charts = (function () {

    function _initPressure() {
        $('#chart-pressure').html('');
        Highcharts.chart('chart-pressure', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Pressure Map'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return this.value; // clean, unformatted number for year
                    }
                },
            },
            yAxis: {
                title: {
                    text: 'Pressure (Pa)'
                },
                min: 1000,
                max: 1450
                // labels: {
                //     formatter: function () {
                //         return this.value / 1000 + 'k';
                //     }
                // }
            },
            tooltip: {
                pointFormat: '{series.name} <b>{point.y} (Pa)</b>'
            },
            plotOptions: {
                area: {
                    pointStart: 1,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                name: 'Pressure points',
                data: [
                    1300, 1345, 1420, 1345, 1130
                ],
            }              
            ]
        });
    }

    function _initPercent() {
        $('#chart-percent').html('');
        Highcharts.chart('chart-percent', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Fit Match'
            },
            tooltip: {
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                colorByPoint: true,
                data: [{
                    name: 'Match',
                    y: 82.5,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Not match',
                    y: 17.5
                }]
            }]
        });
    }

    return {
        initPressure: _initPressure,
        initPercent: _initPercent
    }
})();