
import jQuery from 'jquery'

function initPage(argument) {
    setTimeout(() => {
    	$('.wrap p').html('...Come on! Puma!')
    }, 1500)
}

$(() => {
	initPage()
})