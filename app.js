const box = document.querySelectorAll('[data-col]')
const stats = document.querySelector('.stats')

function Player(name, shape, fill) {
  this.name = name
  this.shape = shape
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
    const row = e.target.parentNode.getAttribute('data-row');
    const column = e.target.getAttribute('data-col')
    if(gameOver) {
      return
    }

    console.log(row, column)

    const player = fillBoard(row, column)
    console.log(board)

    const animate = checkBoard(player)
    console.log(animate)
  })
})

function checkBoard(player) {
  // check row
  for(let i = 0; i < board.length; i++) {
    if(board[i].every(item => item === player.fill)) {
      console.log(`${player.name} has won!`)
      gameOver = true
      return `row ${i}`
    }
  }
}

function switchPlayers(player1, player2) {
  const player = player1.turn ? player1 : player2

  player1.turn = !player1.turn
  player2.turn = !player2.turn

  return player
}

function fillBoard(row, column) {
  // if board already filled return nothing
  if(board[row][column] !== null) {
    return
  }

  const player = switchPlayers(player1, player2)

  console.log(player.name)
  
  board[row][column] = player.fill

  return player
}

