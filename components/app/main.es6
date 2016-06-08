/**
 * FOR App
 */

import {init as robotInit} from './robot/main'

function initPage(argument) {
    robotInit()
    // setTimeout(()=>$('#loading_splash').fadeOut(()=>robotInit()), 2000)
}


$(()=>{
    initPage();
})