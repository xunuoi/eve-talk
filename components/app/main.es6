/**
 * FOR App
 */

import {init as robotInit} from './robot/main'

function initPage(argument) {
    robotInit()

    bindLandingGuide()
    // setTimeout(()=>$('#loading_splash').fadeOut(()=>robotInit()), 2000)
}


function bindLandingGuide(){

    $('#tour').click(function() {
    // Instance the tour
    var tour = new Tour({
        backdrop: true,
        onShown: function(tour) {

            // ISSUE    - https://github.com/sorich87/bootstrap-tour/issues/189
            // FIX      - https://github.com/sorich87/bootstrap-tour/issues/189#issuecomment-49007822

            // You have to write your used animated effect class
            // Standard animated class
            $('.animated').removeClass('fadeIn');
            // Animate class from animate-panel plugin
            $('.animated-panel').removeClass('zoomIn');

        },
          steps: [
          {
            element: ".following-apps",
            title: "This is your following apps",
            content: "The max is 100 Apps"
          },
          {
            element: ".top-charts",
            title: "Top charts Section",
            content: "Top 5 Apps by country and market"
          },
          {
            element: ".top-charts-market",
            title: "Top charts Section",
            content: "Clicking change market"
          },
          {
            element: ".top-charts-country",
            title: "Top charts Section",
            content: "dropdown list change country"
          },
          {
            element: ".top-charts-category",
            title: "Top charts Section",
            content: "dropdown list change category"
          },
          {
            element: ".top-charts-more",
            title: "Top charts Section",
            content: "Clicking view more apps"
          }
        ]});

        // Initialize the tour
        tour.init();

        // Start the tour
        tour.restart();
    });

    
}


function renderDashboardUIChart(){
    /**
     * Flot charts data and options
     */
    var data1 = [
        [0, 55],
        [1, 48],
        [2, 40],
        [3, 36],
        [4, 40],
        [5, 60],
        [6, 50],
        [7, 51]
    ];
    var data2 = [
        [0, 56],
        [1, 49],
        [2, 41],
        [3, 38],
        [4, 46],
        [5, 67],
        [6, 57],
        [7, 59]
    ];

    var chartUsersOptions = {
        series: {
            splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.4
            },
        },
        grid: {
            tickColor: "#f0f0f0",
            borderWidth: 1,
            borderColor: 'f0f0f0',
            color: '#6a6c6f'
        },
        colors: ["#62cb31", "#efefef"],
    };

    $.plot($("#flot-line-chart"), [data1, data2], chartUsersOptions);

    /**
     * Flot charts 2 data and options
     */
    var chartIncomeData = [{
        label: "line",
        data: [
            [1, 10],
            [2, 26],
            [3, 16],
            [4, 36],
            [5, 32],
            [6, 51]
        ]
    }];

    var chartIncomeOptions = {
        series: {
            lines: {
                show: true,
                lineWidth: 0,
                fill: true,
                fillColor: "#64cc34"

            }
        },
        colors: ["#62cb31"],
        grid: {
            show: false
        },
        legend: {
            show: false
        }
    };

    $.plot($("#flot-income-chart"), chartIncomeData, chartIncomeOptions);
}


$(()=>{
    renderDashboardUIChart()
    
    initPage();
})