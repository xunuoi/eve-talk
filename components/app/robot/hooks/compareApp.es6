/**
 * For compare apps
 */

import {blurBg, restoreBg} from '../../ui'


let $stage


function areaChart(){
    $stage.find('.chart-docker[data-target="compare"]').show().find('#facebook_chart').highcharts({
        chart: {
            type: 'area'
        },
        title: {
            text: 'Area chart with negative values'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 2]
        }, {
            name: 'Jane',
            data: [2, -2, -3, 2, 1]
        }, {
            name: 'Joe',
            data: [3, 4, 4, -2, 5]
        }]
    })
}


function downloadChart(){
    $(function () {
        $stage.find('[data-target="compare-download"]').highcharts({
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        });
    });

}




function compareAppSession(word, eve){
    if(word.match('[sS]top')){
        eve.releaseStatus()

        eve.showResponse({
            placeholder: 'next chat',
            response: 'Compare stoped. Thanks. Try another task'
        })

        return false

        //redirect to another input words
        // return 'hello'
    }

    if(word.match(/[dD]ownload\s*/)){

        downloadChart()

        eve.showResponse({
            placeholder: 'download chart',
            response: 'The download status',
            emoji: 'cute'
        })

        return false
    }

    if(word.match(/[fF]ace[bB]ook/)){
        blurBg()
        areaChart()

        eve.showResponse({
            placeholder: 'compare result',
            response: 'Check the chart we got!',
            // emoji: 'happy'
        })

        return false
    }


    eve.showResponse({
        placeholder: 'which app',
        response: 'Just input the app name'
    });

    return false
    
}


$(()=>{
    $stage = $('.stage-docker')
})


export function compareApp(word, eve){

    if(word.match('compare')){
        eve.showResponse({
            placeholder: 'which app',
            response: 'Which app do you want to comare with ?'
        });

        eve.lockStatus(compareAppSession)

        return false;
    }
}