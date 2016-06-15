/**
 * FOR Speaker 
 */


let recognition,
    $go,
    $inputer,
    eve,
    inRecognizing = false


function showResult(rsList){
    var rs = rsList[0][0]

    var txt = rs['transcript'],
        confidence = rs['confidence']

    txt && ($inputer.val(txt), eve.onInput(null, true), $inputer.select())
}


function initSpeech(){
    recognition = recognition || new webkitSpeechRecognition()
    // recognition.lang = 'en-US'

    recognition.onresult = function(event) { 
        // console.log(event) 
        showResult(event['results'])
    }

    recognition.onend = function(event) {
        if($inputer.val() === ''){
            $inputer.attr('placeholder', 'Sorry, what?')
        }
        inRecognizing = false
    }

}

function onSpeech(){
    
    $inputer.attr('placeholder', 'Listening...')
    $inputer.val('')
    // eve.showResponse({
    //     placeholder: 'Listening...'
    //     // response: 'Just speak to me'
    // })
    
    !inRecognizing && (recognition.start(), inRecognizing = true)

}


function voiceSpeak(textToSpeak, byWhom, volume) {
    //create SpeechSynthesisUtterance的实例
    var robotUtterance = new SpeechSynthesisUtterance()
    // robotUtterance.lang = 'en-US'

    var voices = window.speechSynthesis.getVoices()
    robotUtterance.voice = voices.filter(voice=>voice.name == (byWhom ? byWhom : 'Google US English'))[0]

    robotUtterance.rate = 0.8

    volume !== undefined ? (robotUtterance.volume = volume) : ''
    // robotUtterance.voice = voices[9]
    // set text
    robotUtterance.text = textToSpeak
    // put into queue
    window.speechSynthesis.speak(robotUtterance)
}
// for Chrome bugs,first voice.
window.speechSynthesis.getVoices()


function init(_eve){
    eve = _eve

    $go = $('#speaker_btn'),
    $inputer = $('#x_robot_dialog .x-rb-dialog-input')

    $go.on('click', evt=>onSpeech(evt))

    initSpeech()
}


export {
    init,
    voiceSpeak
}
