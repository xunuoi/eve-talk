/**
 * For compare apps
 */

import {blurBg, restoreBg} from '../../ui'


let $stage


Highcharts.setOptions({  
       colors: ['#50B432','#058DC7', '#ED561B','#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']  
})

function downloadLineChart($ctn, isSimple){
    $ctn = $ctn || $stage.find('.chart-docker[data-target="compare"]').prependTo($stage)

    $ctn.show()
    .find('.chart-docker-body').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: isSimple ? false : 'Download Comparison in Last Week'
        },
        xAxis: {
            categories: ['1', '2', '3', '4', '5', '6', '7']
        },
        yAxis: {
            title: {
                text: isSimple ? false : 'Count (M)'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Wechat',
            data: [6.21, 5.32, 4.12, 6.01, 3.21, 4.30 ,5.20]
        }, {
            name: 'Facebook',
            data: [5.52, 6.03, 4.42, 3.98, 5.21, 7.28, 8.02]
        }]
    })
}


function revenueColumnChart($ctn, isSimple){
    $ctn = $ctn || $stage.find('.chart-docker[data-target="compare-download"]').prependTo($stage)

    $ctn.show()
    .find('.chart-docker-body')
    .highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: isSimple ? false : 'Revenue Comparison'
        },
        /*subtitle: {
            text: 'Source: appannie.com'
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
                text:  isSimple ? false : 'Revenue (M)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} M</b></td></tr>',
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
            name: 'Wechat',
            data: [49.9, 71.5, 106.4, 129.2]

        }, {
            name: 'Facebook',
            data: [83.6, 78.8, 98.5, 93.4]

        }]
    })

}

function compareAppSession(word, eve){
    if(word.match(/^([sS]top|[f|F]inish)(\s+[c|C]ompare)?$/)){
        eve.releaseStatus()

        eve.showResponse({
            placeholder: 'task finished',
            response: 'Compare task stoped. Try new things'
        })

        return false

        //redirect to another input words
        // return 'hello'
    }

    if(word.match(/^(by\s+)?[dD]ownload\s*/)){
        blurBg()
        downloadLineChart()

        eve.showResponse({
            placeholder: 'Download Comparison',
            response: 'Wechat has 0.69 million downloads more than Facebook in Day 1',
            // emoji: 'cute'
        })

        return false
    }

    if(word.match(/[fF]ace[bB]ook/)){
        blurBg()

        revenueColumnChart()

        eve.showResponse({
            placeholder: 'Revenue Comparison',
            response: 'Wechat Revenue has 33.7 million less than Facebook in Quarter 1',
            // emoji: 'happy'
        })

        return false
    }

    if(word.match(/[a|A]dd\s+(to\s+)?favorites?/)){
        
        $('.stage-docker .add-favorite-btn')
        .addClass('favorited')
        .find('i')
        .addClass('fa-star')
        .removeClass('fa-star-o')
        
        $(this).toggleClass('favorited')

        eve.showResponse({
            placeholder: 'Add to favorite',
            response: 'Add to Favorite Board succeed!<br /> Click <a href="/favorite" target="_blank" >Favorite</a> link to check it',
            // emoji: 'happy'
        })

        return false
    }
    
    eve.showResponse({
        placeholder: 'which app',
        response: 'Please enter the [App Name] or [Data] in the situation'
    });

    return false
    
}


function bindFavorite(){
    $('.stage-docker').on('click', '.add-favorite-btn', function(event) {
        $(this).find('i')
        // .toggleClass('fa')
        .toggleClass('fa-star')
        .toggleClass('fa-star-o')

        $(this).toggleClass('favorited')

        return false
    })
}

function bindClose(){
    $('.stage-docker').on('click', '.chart-close-btn', function(event){
        $(this).parents('.map-docker').hide()
        $(this).parents('.chart-docker').hide()

        return false
    })
}


$(()=>{
    $stage = $('.stage-docker')

    bindFavorite()
    bindClose()
})


function compareApp(word, eve){

    if(word.match(/^compare(\s+revenue)?$/)){
        var sentence = 'Which app do you want to compare with ?'

        eve.showResponse({
            placeholder: 'which app',
            response: sentence
        });

        eve.lockStatus(compareAppSession)

        return false;
    }
}

export {
    compareApp,

    revenueColumnChart,
    downloadLineChart
}