var mainGrid = document.querySelector("#main-grid")
var board = []


var states = {
    0: "#FFFFFF",
    1: "#000000",
    2: "#00FF00",
    3: "#FF0000",
    "ROUTE": "#002AFF"
}


var rows = 20
var cols = 20

var wayPoints = null


class Cell {

    #edge = false

    constructor(index, element, edge=false) {
        this.index = index
        this.element = element
        this.state = 0
        this.hovered = false

        if (edge) this.changeState()
        this.#edge = edge  
    }

    changeState() {
        if (this.#edge) return;

        if (wayPoints) {
            for (let waypoint of wayPoints) {
                let cell = board[waypoint.y-1][waypoint.x-1]
                if (cell.state!==3) cell.setState(0)
                wayPoints = null
            }
        }

        this.state += 1
        if (!states[this.state]) this.state = 0


        this.element.style.backgroundColor = states[this.state]
    }

    setState(state) {
        if (this.#edge) return;
        this.state = state
        this.element.style.backgroundColor = states[this.state]
    }

    getNxtColor() {
        if (this.#edge) return;
        
        let nState = this.state + 1
        if (!states[nState]) nState = 0

        if (this.state=="ROUTE") return states[1]
        return states[nState]
    }

    setPrevColor() {
        if (this.#edge) return;

        let nState = this.state
        if (!states[nState]) nState = 3

        this.element.style.backgroundColor = states[nState]
    }

}

function load(rows, columns) {
    rows+=2
    columns+=2
    mainGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`
    mainGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`

    mainGrid.childNodes = null
    for (let row=0;row<rows;row++) {
        let rowArr = []
        for (let col=0;col<columns;col++) {
            let div = document.createElement("div")
            mainGrid.appendChild(div)

            let state = 0

            if (row==0 || col==0 || row==rows-1|| col==columns-1) state = 1
            let cell = new Cell(row*columns+col, div, state)
            rowArr.push(cell)

            div.dataset.y = row
            div.dataset.x = col

            div.onclick = cellClicked
            div.onmouseenter = cellEnter
            div.onmouseleave = cellLeave
        }
        board.push(rowArr)
    }
}


function cellClicked() {
    let pos = this.dataset
    let cell = board[pos.y][pos.x]

    cell.hovered = false
    cell.element.style.opacity = "1" 
    cell.changeState()
}

function cellEnter() {
    let pos = this.dataset
    let cell = board[pos.y][pos.x]

    cell.hovered = true
    cell.element.style.opacity = "0.8"
    cell.element.style.backgroundColor = cell.getNxtColor()
}

function cellLeave() {
    let pos = this.dataset
    let cell = board[pos.y][pos.x]

    if (!cell.hovered) return;
    cell.element.style.opacity = "1"
    cell.hovered = false
    cell.setPrevColor()
}

function loadArrayFromGrid() {
    let boardArray = [] 

    for (let row of board) {
        let rowArray = []
        for (let col of row) {
            rowArray.push(col.state)
        }
        boardArray.push(rowArray)
    }

    return boardArray
}



load(rows, cols)

function solveBtnClick(btn) {

    if (wayPoints) {
        for (let waypoint of wayPoints) {
            let cell = board[waypoint.y-1][waypoint.x-1]
            
            if (cell.state!==3) cell.setState(0)
        }
    }

    let pathfindGrid = loadArrayFromGrid()
    let pathfinder = new Pathfinder(pathfindGrid)
    
    wayPoints = pathfinder.solvePath()

    for (let wayPoint of wayPoints) {
        let cell = board[wayPoint.y-1][wayPoint.x-1]
        
        if (cell.state != 3 && cell.state != 4) cell.setState("ROUTE")
    }

    btn.textContent = `Solve (${wayPoints.length})`
}
