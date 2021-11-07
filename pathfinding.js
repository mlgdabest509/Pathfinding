// Pathfinding with the A* algorithm


class Pathfinder {

    constructor(board) {
        this.board = board
    }

    solvePath() {
        const board = this.board
        var displayBoard = []
        for (var i = 0; i < board.length; i++) {
            displayBoard[i] = board[i].slice()
        }


        const PLAYER = 2 
        const WALL = 1
        const GOAL = 3
        const AIR = 0


        function getTagPos(tag) {
            let y = 0;
            var found = null
            board.forEach(row => {
                y += 1;
                let x = 0;
                row.forEach(column => {
                    x += 1;
                    if (column == tag) found = {x: x, y: y}
                })
            });

            return found
        }


        var goalPos = getTagPos(GOAL)
        var startPos = getTagPos(PLAYER)

        class Field {
            constructor(pos, awaker) {
                this.pos = pos
                this.sd = sd(pos)
                this.gd = gd(pos)
                this.d = this.sd.d + this.gd.d
                this.awaker = awaker
                try {
                    this.val = board[pos.y-1][pos.x-1]
                }   
                catch {}
            }
        }

        function crPos(x, y) {
            return {x: x, y: y}
        }

        var revealed = [new Field(startPos)]
        var notLowest = [new Field(startPos)]

        var ended = goalReached()
        while (!ended) {
            let low = lf()
            revealFields(low.pos, low)
            delete notLowest[notLowest.indexOf(low)]
            ended = goalReached()
        }

        return solveRoute(ended)


        function goalReached() {
            var field = null
            revealed.forEach((f) => {
                if (f.gd.d <= 0) field = f
            }) 

            return field
        }

        function lf(start=true) {

            let sorted = notLowest.sort((a, b) => a.d-b.d).sort((a, b) => a.gd.d-b.gd.d)
            return sorted[0]
        }


        function solveRoute(founder) {
            var cf = founder
            var path = []

            while(!cf.sd.d == 0) {
                path.push({x: cf.pos.x, y: cf.pos.y})
                displayBoard[cf.pos.y-1][cf.pos.x-1] = "7"

                cf = cf.awaker
            }
            return path
        }

        function revealFields(pos, founder) {

            let x = pos.x
            let y = pos.y
            for (let i = 0; i < 8; i++) {
                let field = null
                switch(i) {
                    case 0:
                        // Left
                        field = new Field(crPos(x-1, y), founder)
                        break
                    case 1:
                        // LeftUp
                        field = new Field(crPos(x-1, y+1), founder)
                        break
                    case 2:
                        // Up
                        field = new Field(crPos(x, y+1), founder)
                        break
                    case 3:
                        // RightUp
                        field = new Field(crPos(x+1, y+1), founder)
                        break
                    case 4:
                        // Right
                        field = new Field(crPos(x+1, y), founder)
                        break
                    case 5:
                        // RightDown
                        field = new Field(crPos(x+1, y-1), founder)
                        break
                    case 6:
                        // Down
                        field = new Field(crPos(x, y-1), founder)
                        break
                    case 7:
                        // LeftDown
                        field = new Field(crPos(x-1, y-1), founder)
                        break
                }
                if(field.val !== WALL && revealed.filter((v => v.pos.x == field.pos.x && v.pos.y == field.pos.y)).length <= 0 && field.pos !== startPos && inRange(field.pos)) {
                    revealed.push(field)
                    notLowest.push(field)
                    if (goalReached()) {
                        displayBoard[field.pos.y-1][field.pos.x-1] = 8
                        display()
                        return
                    }
                    displayBoard[field.pos.y-1][field.pos.x-1] = "SE"
                }
            }

        }


        function inRange(pos) {
            return pos.x > 0 && pos.x < board[0].length && pos.y > 0 && pos.y < board.length
        }

        function display() {
            let displayed = ""
            displayBoard.forEach((row) => {
                let sR = ""
                row.forEach((col) => {
                    if (col=="0") col="AI"
                    if (col=="3") col="WA"
                    if (col=="1") col="ST"
                    if (col=="8") col="GO"
                    if (col=="7") col="RO"
                    sR += col+" "
                })
                displayed+=sR+"\n"
            })

        }

        function sd(pos) {
            return calculateDistance(startPos, pos)
        }

        function gd(pos) {
            return calculateDistance(goalPos, pos)
        }
        function calculateDistance(pos1, pos2) {

            let xDistance = Math.abs(pos1.x - pos2.x)
            let yDistance = Math.abs(pos1.y - pos2.y)
            
            return {x: xDistance, y: yDistance, d: xDistance + yDistance}
        }
    }
}