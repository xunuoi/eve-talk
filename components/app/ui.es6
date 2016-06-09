
let $mainContent


function blurBg(){
    $mainContent.addClass('blur-stage')
}

function restoreBg(){
    $mainContent
    .addClass('restore-stage')
    .removeClass('blur-stage')

    setTimeout(()=>$mainContent
        .removeClass('restore-stage')
        .removeClass('blur-stage'), 
    800)
}


function loadingCover () {
    $('#loading_splash').show();
}

function loadingUncover (){
    $('#loading_splash').hide();
}

$(()=>{
    $mainContent = $("#header, #menu, #wrapper")
})


export {

    blurBg,
    restoreBg,

    loadingCover,
    loadingUncover
}