

function helpSession(word, eve){
    if(word.match('stop')){
        eve.releaseStatus()

        eve.showResponse({
            placeholder: 'Help stop',
            response: 'Stopped!'
        });

        return false

        //redirect to another input words
        // return 'hello'
    }

    if(word.match(/(doctor)|(dr(\.)?)/)){
        eve.showResponse({
            placeholder: 'Doctor',
            response: 'Nurse girl!'
        }); 

        return false
    }


    eve.showResponse({
        placeholder: 'In help',
        response: 'Go on. In help'
    });

    return false
    
}


export function help(word, eve){

    if(word.match('help')){
        eve.showResponse({
            placeholder: 'Get Help',
            response: 'yes good'
        });

        eve.lockStatus(helpSession)

        return false;
    }
}