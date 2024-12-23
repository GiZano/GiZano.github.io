console.log("Program developed to calculate the cyclic redundancy code (CRC)")

var trasmission
var generator = ""
var base
var base2 = ["0", "1"]
var base10 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
var CRC = ""
var partial = ""
var result = ""

var l = 0

function showCalculator(){
    document.getElementById("calculator").style.display = "block"
}

function calculate(){

    getData()
    
    if( !checkMsgValues() ){
        document.getElementById("result").innerHTML = "Result: <i>Sequence doesn't correspond to the base!!!</i>"
        return
    }
   
    else if( !checkGenerator() ){
        document.getElementById("result").innerHTML = "Result: <i>Generator not acceptable!!!</i>"
    }
    else{
        if(base == "10") trasmission = changeBase()
        if( !checkTrasGenFit() ){
            document.getElementById("result").innerHTML = "Result: 0b <i>Sequence not long enough!!!</i>"
            return
        }
        else{
            findCRC()
            result = trasmission + CRC
            setData()
        }
        
    }
    
}

function getData(){

    trasmission = "" + document.getElementById("trasmission").value 

    generator = "" + document.getElementById("generator").value

    base = document.getElementById("base").value
    
}

function checkTrasGenFit(){
    if( !( generator.length < trasmission.length) ) {
        return false
    }
    return true
}

function checkMsgValues(){
    switch(base){
        case "0b":
            for(i = 0; i < trasmission.length; i++){
                if( !( trasmission[i] in base2 ) ){
                    return false
                }
            }
            break
        case "10":
            for(i = 0; i < trasmission.length; i++){
                if( !( trasmission[i] in base10 ) ){
                    return false
                }
            }

    }
    return true
}

function checkGenerator(){
    if(generator == "" || generator.length == 1) return false // not acceptable if empty or made out of 1 bit
    if( generator.lastIndexOf(1) != (generator.length - 1) ) return false // the first bit (from right) has to be 1

    for(i = 0; i < generator.length; i++){
        if( !( generator[i] in base2 ) ){
            return false
        }
    }
    return true
}

function changeBase(){

    newMsg = ""

    do{
        newMsg = (trasmission % 2) + newMsg
        trasmission = parseInt( trasmission / 2)
    }while(trasmission > 0)

    base = "0b"

    return newMsg
    
}

function findCRC(){
    
    partial = trasmission

    for(i = 0; i < generator.length - 1; i++) partial += "0"

    length = partial.length

    var i = 0
    var j = 1
    
    do{
        for(i; i < length; i++){
            
            if( i >= ( length - (generator.length - 1)) ){
                CRC = partial.slice(length - (generator.length - 1), length)
                return
            }

            if(partial[i] == "1") break;
        }

        last = i + generator.length - 1

        k = 0

        for(i; i <= last; i++){

            if(partial[i] != generator[k]){
                partial = changeCharacter(partial, i, "1")
            }
            else{
                partial = changeCharacter(partial, i, "0")
        }
            k++
        }

        i -= (partial.length - 1)

    }while( i < length)
}


function changeCharacter(sequence, index, newValue){

    newText = ""

    for(i = 0; i < index; i++){
        newText += sequence[i]
    }

    newText += newValue

    for(i = index+1; i < sequence.length; i++){
        newText += sequence[i]
    }

    return newText
}

function setData(){
    document.getElementById("start").innerHTML = "Initial trasmission: " + (base == 10 ? "" : base) + trasmission
    document.getElementById("gen").innerHTML ="Generator: 0b" + generator
    document.getElementById("suffix").innerHTML = "CRC: 0b" + CRC
    document.getElementById("result").innerHTML = "Result: 0b" + result
}
