/**
 * FOR Speaker 
 */


let recognition,
    $go,
    $inputer,
    eve


function showResult(rsList){
    var rs = rsList[0][0]

    var txt = rs['transcript'],
        confidence = rs['confidence']

    txt && ($inputer.val(txt), eve.onInput(null, true), $inputer.select())
}


function initSpeech(){
    recognition = new webkitSpeechRecognition()
      
    recognition.onresult = function(event) { 
        // console.log(event) 
        showResult(event['results'])
    }
}

function onSpeech(){

    $inputer.val('Listening...')
    // eve.showResponse({
    //     placeholder: 'speak',
    //     response: 'I a listening...',
    // })
    recognition.start()
}


function init(_eve){
    eve = _eve

    $go = $('#speaker_btn'),
    $inputer = $('#x_robot_dialog .x-rb-dialog-input')

    $go.on('click', evt=>onSpeech(evt))

    initSpeech()
}


export {
    init
}
