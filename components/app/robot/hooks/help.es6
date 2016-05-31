


export function help(word, eve){
    if(word.match('help')){
        eve.showResponse({
            placeholder: 'Get Help',
            response: 'yes good'
        });

        return false;
    }
}