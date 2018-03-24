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
                text: 'Sub title text here'
            },
            xAxis: {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return this.value; // clean, unformatted number for year
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Pressure (Pa)'
                },
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
                name: 'Bust',
                data: [
                    1300, 1345, 1420, 1345, 1322
                ]
            }, {
                name: 'Waist',
                data: [
                    1017, 900, 1000, 1002, 1050
                ]
            }, {
                name: 'Hips',
                data: [
                    1097, 1090, 1050, 1100, 1097
                ]
            }, {
                name: 'Hip',
                data: [
                    1190, 1180, 1179, 1179, 1179
                ]
            },
                {
                    name: 'Caviar Muscle',
                    data: [
                        1190, 1195, 1170, 1172, 1173
                    ]
                },
                {
                    name: 'Neck',
                    data: [
                        1030, 1031, 1032, 1030, 1025
                    ]
                },
                {
                    name: 'Biceps',
                    data: [
                        1190, 1000, 1001, 1002, 1003
                    ]
                },
                {
                    name: 'Wrist',
                    data: [
                        1097, 1050, 1051, 1052, 1053
                    ]
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
                text: 'Cloth Match'
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