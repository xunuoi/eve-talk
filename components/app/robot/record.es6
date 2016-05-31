/**
 * For record robot input words
 */

function Record($goinput){
    var inputList = [],
        pos = 0,
        len = 0;

    var exp = {
        save: function(str){
            inputList.push(str);
            len++;
            pos = len;
        },
        getPre: function(){
            if(pos == 0){
                return inputList[0];
            }else {
                return inputList[--pos];
            }
        },
        getNext: function(){
            if(pos >= len-1){
                return inputList[len-1];
            }else {
                return inputList[++pos];
            }
        },
        print: function(str){
            var cur = str || inputList[pos];
            $goinput.val(cur);
        },
        printPre: function(){
            this.print(this.getPre());
        },
        printNext: function(){
            this.print(this.getNext());
        }
    } 
    return exp;
}

export function init($input){
    return Record($input)
}