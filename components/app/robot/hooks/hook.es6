/**
 * Hook Modules
 */

import {help} from './help'
import {blurBg, restoreBg, loadingCover} from '../../ui'
import {compareApp} from './compareApp'
import {downloadMap} from './downloadMap'

import {landingGuide} from './landingGuide'


let list = [
    help,
    landingGuide,
    
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
        })

    
        eve.releaseStatus()

        return false
    }

    if(word.match(/^[s|S]how\s+[l|L]oading(\s+[u|U][iI])?\b/)){
        eve.selectInput()
        loadingCover()
        return false
    }

    if(word.match(/[c|C]hange\s+[s|S]kin/)){
        eve.switchSkin()
        eve.showResponse({
            placeholder: 'okay',
            response: 'Look at my new skin.'
        })

        return false
    }

    if(word.match(/([q|Q]uit)|([e|E]xit)/)){
        
        eve.showResponse({
            placeholder: 'Bye',
            response: 'See you later, guy'
        })

        setTimeout(()=>{
            $('#robot_switcher').trigger('click')
        }, 900)

        return false
    }
}


export {
    list,
    commonHook
}

