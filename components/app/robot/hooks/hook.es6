/**
 * Hook Modules
 */

import {help} from './help'
import {blurBg, restoreBg, loadingCover} from '../../ui'
import {compareApp} from './compareApp'
import {downloadMap} from './downloadMap'


let list = [
    help,
    downloadMap,
    compareApp
]

function commonHook(word, eve){
    if(word.match(/[cC]lear\s*([sS]tage)?/)){
        $('.chart-docker-body').empty()
        $('.map-docker').empty().hide()
        $('.chart-docker').hide();
        restoreBg();

        eve.showResponse({
            placeholder: 'new subject',
            response: 'Stage is clear now'
        });

    
        eve.releaseStatus()

        return false
    }

    if(word.match(/^[s|S]how\s+[l|L]oading(\s+[u|U][iI])?\b/)){
        eve.selectInput()
        loadingCover()
        return false
    }
}


export {
    list,
    commonHook
}

