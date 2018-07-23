import svg from './svg'

function Player(name, shape, fill) {
  this.name = name
  this.shape = svg[shape]
  this.score = 0
  this.turn = false
  this.fill = fill
}

// const player1 = new Player('Jerry', 'cross', 1)
// const player2 = new Player('Cece', 'circle', 0)

const data = {
  board: [
    [null,null,null],
    [null,null,null],
    [null,null,null]
  ],
  player1: new Player('Jerry', 'cross', 1),
  player2: new Player('Cece', 'circle', 0),
  gameOver: false,
}

export default data