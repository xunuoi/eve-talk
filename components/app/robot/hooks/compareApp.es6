/**
 * For compare apps
 */

import {blurBg, restoreBg} from '../../ui'


let $stage


function downloadLineChart(){
    $stage.find('.chart-docker[data-target="compare"]').show().find('.chart-docker-body').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: 'Download Comparison in Last Week'
        },
        xAxis: {
            categories: ['1', '2', '3', '4', '5', '6', '7']
        },
        yAxis: {
            title: {
                text: 'Count (M)'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Wechat',
            data: [6, 5, 4, 7, 3, 4,5]
        }, {
            name: 'Facebook',
            data: [5, 6, 4, 6, 5, 7, 8]
        }]
    })
}


function revenueColumnChart(){

    $stage.find('.chart-docker[data-target="compare-download"]').show().find('.chart-docker-body')
    .highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Revenue Comparison'
        },
        /*subtitle: {
            text: 'Source: WorldClimate.com'
        },*/
        xAxis: {
            categories: [
                'Q1',
                'Q2',
                'Q3',
                'Q4'
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Revenue (M)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Tokyo',
            data: [49.9, 71.5, 106.4, 129.2]

        }, {
            name: 'New York',
            data: [83.6, 78.8, 98.5, 93.4]

        }]
    })

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

        downloadLineChart()

        eve.showResponse({
            placeholder: 'download chart',
            response: 'The download status',
            emoji: 'cute'
        })

        return false
    }

    if(word.match(/[fF]ace[bB]ook/)){
        blurBg()

        revenueColumnChart()

        eve.showResponse({
            placeholder: 'compare result',
            response: 'Check the chart we got!',
            // emoji: 'happy'
        })

        return false
    }

    if(word.match(/[a|A]dd\s+(to\s+)?favorites?/)){
        
        // $('.chart-docker').addClass('ani-to-favorite')

        eve.showResponse({
            placeholder: 'Add to favorite',
            response: 'Add to favorite succeed!<br /> Click <a href="/collection" target="_blank" >here</a> to check',
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