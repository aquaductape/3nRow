const box = document.querySelectorAll('[data-col]')
const stats = document.querySelector('.stats')

function Player(name, shape, fill) {
  this.name = name
  this.shape = svg[shape]
  this.score = 0
  this.turn = false
  this.fill = fill
}

const board = [
  [null,null,null],
  [null,null,null],
  [null,null,null]
]

const player1 = new Player('Jerry', 'cross', 1)
const player2 = new Player('Cece', 'circle', 0)

let gameOver = false

//Player One goes first
player1.turn = true



box.forEach((item) => {
  item.addEventListener('click', (e) => {
    const row = e.target.parentNode.getAttribute('data-row')
    const column = e.target.getAttribute('data-col')
    const fill = e.target

    const foo = { name: 'whatever'}
    if(gameOver) {
      return
    }

    console.log(row, column)

    const player = fillBoard(row, column, fill)
    console.log(board)

    const animate = checkBoard(player)
    console.log(animate)
  })
})

function checkBoard(player) {
  // check row
  for(let row = 0; row < board.length; row++) {
    if(board[row].every(item => item === player.fill)) {
      console.log(`${player.name} has won!`)
      gameOver = true
      return `row${row}`
    }

    // check column
    let count = 0
    for(let column = 0; column < board.length; column++) {
      if(board[column][row] === player.fill) {
        count++
        if(count === board.length) {
          console.log(`${player.name} has won!`)
          gameOver = true
        }
      }
    }
  }

  //check diagonal
  let diagonal1 = 0
  let diagonal2 = 0
  // [0,0][1,1][2,2]
  // [0,2][1,1][2,0]
  for(let i = 0; i < board.length; i++) {
    if(board[i][i] === player.fill) {
      diagonal1++
      if(diagonal1 === board.length) {
        console.log(`${player.name} has won!`)
        gameOver = true
      }
    }
    
    if(board[i][board.length - 1 -i] === player.fill) {
      diagonal2++
      if(diagonal2 === board.length) {
        console.log(`${player.name} has won!`)
        gameOver = true
      }
    }
  }

}

function switchPlayers(player1, player2) {
  const player = player1.turn ? player1 : player2

  player1.turn = !player1.turn
  player2.turn = !player2.turn

  return player
}

function fillBoard(row, column, fill) {
  // if board already filled return nothing
  if(board[row][column] !== null) {
    return
  }
  
  const player = switchPlayers(player1, player2)
  // document.querySelector('div').firstElementChild
  fill.firstElementChild.innerHTML = player.shape
  // console.log(fill)

  console.log(player.name)
  
  board[row][column] = player.fill


  return player
}
