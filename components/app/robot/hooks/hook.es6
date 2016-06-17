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
    if(word.match(/^[cC]lear\s*([sS]tage)?/)){
        $('.chart-docker-body').empty()
        $('.map-docker').empty().hide()
        $('.chart-docker').hide();
        restoreBg();

        eve.showResponse({
            placeholder: 'Enter new subject',
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

    if(word.match(/^[c|C]hange\s+[r|R]ole$/)){
        eve.switchSkin()
        eve.showResponse({
            placeholder: 'okay',
            response: 'Hi guy.'
        })

        return false
    }

    if(word.match(/^([q|Q]uit)|([e|E]xit)/)){
        eve.releaseStatus()
        eve.showResponse({
            placeholder: 'Bye',
            response: 'See you later, guy'
        })

        setTimeout(()=>{
            $('#robot_switcher').trigger('click')
            eve.showResponse({
                placeholder: 'new subject',
                response: ''
            })
        }, 900)

        return false
    }


    // for listening
    if(word.match(/^[l|L]isten$/)){
        
        $('#speaker_btn').trigger('click')

        
        return false
    }


    // for audio listen
    let listenRs
    if(listenRs = word.match(/^[s|S]peak\s+out(\s+by\s+)?([\w\s]+$)?/)){
        var pron = listenRs[1]
        var byWhom = listenRs[2]

        if(byWhom == 'Andrew') {
            byWhom = 'Alex'
        }
        // console.log(byWhom)

        eve.voiceSpeak(null, pron && byWhom ? byWhom : null)

        listenRs = null

        return false
    }

    // show speakers
    if(word.match(/^[s|S]how\s+(speaker|voice)s?/)){
        // for first speak 
        window.speechSynthesis.getVoices()
        // get result
        var voices = window.speechSynthesis.getVoices()

        let sList = voices.filter(voice=>voice.lang == 'en-US')

        var sHtml = 'Speakers are Below:<br />'
        sList.forEach((item, index)=>{
            sHtml += `${item.name}, `
        })

        eve.showResponse({
            placeholder: 'Check it',
            response: sHtml
        })

        return false
    }


    if(word.match(/^(stop\s+speaking)|sp$/)){
        eve.setInput('Okay')
        eve.selectInput()
        window.speechSynthesis.cancel()

        return false
    }

    if(word.match(/^fullscreen$/)){
        try{
            document.documentElement.webkitRequestFullScreen()
            eve.setInput('Okay')
            eve.selectInput()
        }catch(err){
            alert('Your browser do not support Fullscreen')
        }
        

        return false
    }

    if(word.match(/^cancel\s+fullscreen$/)){
        try{
            document.webkitCancelFullScreen()
        }catch(err){
            alert('Your browser do not support Fullscreen')
        }
        

        return false
    }
}


export {
    list,
    commonHook
}

