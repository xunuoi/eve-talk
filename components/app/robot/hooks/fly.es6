

export function fly(word, eve){
    if(word.match('fly')){
        alert('nima fly')
        eve.showResponse({
            placeholder: 'Get fly',
            response: 'yes fly'
        });

        return false;
    }
}