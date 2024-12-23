var first_number
var second_number
var third_number

function playGame() {

    showSlot()
    generateNumbers()
    setNumbers()
    if(checkWin()){
        document.getElementById("result").innerHTML="Congratulations, you won!!"
    }
    else{
        document.getElementById("result").innerHTML="Maybe next time..."
    }


}

function setNumbers() {
    document.getElementById("first").innerHTML = first_number
    if(first_number >= 5){
        document.getElementById("first").style.backgroundColor = "green"
    }
    else document.getElementById("first").style.backgroundColor = "#DA4167";

    document.getElementById("second").innerHTML = second_number
    if(second_number >= 5){
        document.getElementById("second").style.backgroundColor = "green"
    }
    else document.getElementById("second").style.backgroundColor = "#DA4167";

    document.getElementById("third").innerHTML = third_number
    if(third_number >= 5){
        document.getElementById("third").style.backgroundColor = "green"
    }
    else document.getElementById("third").style.backgroundColor = "#DA4167";
}

function generateNumbers() {
    first_number = Math.floor(Math.random() * 10)
    second_number = Math.floor(Math.random() * 10)
    third_number = Math.floor(Math.random() * 10)
}

function checkWin() {
    if(first_number >= 5 && second_number >= 5 && third_number >= 5){
        return true
    }
    else return false
}

function showSlot(){
    document.getElementById("slot").style.display = "flex"
    document.getElementById("result").style.display = "block"
}

