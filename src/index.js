import data from './gameData'

const box = document.querySelectorAll('[data-col]')
const stats = document.querySelector('.stats')


//Player One goes first
data.player1.turn = true



box.forEach((item) => {
  item.addEventListener('click', (e) => {
    const row = e.target.parentNode.getAttribute('data-row')
    const column = e.target.getAttribute('data-col')
    const fill = e.target

    console.log(row, column)

    const player = fillBoard(row, column, fill)
    console.log(data.board)

    const animate = checkBoard(player)
    console.log(animate)
  })
})

function checkBoard(player) {
  // returns when game is over or tile is already filled
  if(!player) {
    return null
  }

  // check row
  for(let row = 0; row < data.board.length; row++) {
    if(data.board[row].every(item => item === player.fill)) {
      stats.innerHTML = `${player.name} has won!`
      data.gameOver = true
      return `row${row}`
    }

    // check column
    let count = 0
    for(let column = 0; column < data.board.length; column++) {
      if(data.board[column][row] === player.fill) {
        count++
        if(count === data.board.length) {
          stats.innerHTML = `${player.name} has won!`
          data.gameOver = true
        }
      }
    }
  }

  //check diagonal
  let diagonal1 = 0
  let diagonal2 = 0
  // [0,0][1,1][2,2]
  // [0,2][1,1][2,0]
  for(let i = 0; i < data.board.length; i++) {
    if(data.board[i][i] === player.fill) {
      diagonal1++
      if(diagonal1 === data.board.length) {
        stats.innerHTML = `${player.name} has won!`
        data.gameOver = true
      }
    }
    
    if(data.board[i][data.board.length - 1 -i] === player.fill) {
      diagonal2++
      if(diagonal2 === data.board.length) {
        stats.innerHTML = `${player.name} has won!`
        data.gameOver = true
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
  if(data.board[row][column] !== null || data.gameOver) {
    return null
  }
  
  const player = switchPlayers(data.player1, data.player2)
  // document.querySelector('div').firstElementChild
  fill.firstElementChild.innerHTML = player.shape
  // console.log(fill)

  stats.innerHTML = `${player.name}, it's your time to shine!`
  
  data.board[row][column] = player.fill


  return player
}
