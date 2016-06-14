
function landingGuide(word, eve) {
    if(word.match(/([h|H]ow\s+to\s+)?use\s+(filter|dashboard|board)(\s+\?)?/)){
        
        eve.showResponse({
            placeholder: 'Check it',
            response: 'Follow the guide'
        });
        
        $('#tour').trigger('click')

        
        return false
    }

}

export {
    landingGuide
}
