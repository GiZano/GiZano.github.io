var turn
var tris = []
function showTris() {
    document.getElementById("tris").style.display = 'table'
    document.getElementById("startTris").style.background = 'var(--primary400)'
    document.getElementById("startTris").style.color = 'white'

}

function advertPlayer(turn) {
    document.getElementById("console").innerHTML = 'Player ' + turn
}

function resetTris() {
    for (i = 1; i < 10; i++) {
        tris[i] = parseInt(10)
        document.getElementById(i).innerHTML = ''
    }
}

function checkWin() {

    // riga 1

    sum = (tris[1] + tris[2] + tris[3]) / 3
    if (sum == turn) return true

    // riga 2

    sum = (tris[4] + tris[5] + tris[6]) / 3
    if (sum == turn) return true

    // riga 3

    sum = (tris[7] + tris[8] + tris[9]) / 3
    if (sum == turn) return true

    // colonna 1

    sum = (tris[1] + tris[4] + tris[7]) / 3
    if (sum == turn) return true

    // colonna 2

    sum = (tris[2] + tris[5] + tris[8]) / 3
    if (sum == turn) return true

    // colonna 3

    sum = (tris[3] + tris[6] + tris[9]) / 3
    if (sum == turn) return true

    // diagonale 1

    sum = (tris[1] + tris[5] + tris[9]) / 3
    if (sum == turn) return true

    // diagonale 2

    sum = (tris[3] + tris[5] + tris[7]) / 3
    if (sum == turn) return true

    return false
}

function checkFull() {
    for (i = 1; i < 10; i++) {
        if (tris[i] == 10) {
            return false
        }
    }
    return true
}

function select(cell) {
    if (tris[cell] == 10) {
        document.getElementById(cell).innerHTML = (turn == 1 ? 'X' : 'O')
        tris[cell] = parseInt(turn)
        console.log(tris[cell])

        if (checkWin()) {
            document.getElementById("console").innerHTML = 'Congratulations, player ' + turn + ', you <i>won</i>!!'
            document.getElementById("again").style.display = 'block'

        }
        else if (checkFull()) {
            document.getElementById("console").innerHTML = 'Space Full, <i>Tie</i>!'
            document.getElementById("again").style.display = 'block'
        }
        else {
            turn = (turn == 1 ? 2 : 1)
            advertPlayer(turn)
        }
    }
}

function giocaTris() {
    console.log("Game Started!")
    turn = 1
    showTris()
    resetTris(tris)
    advertPlayer(turn)
}