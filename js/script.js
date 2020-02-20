const canvas = document.querySelector('canvas')
//context - отрисовка 
const context = canvas.getContext('2d')

canvas.width = 500
canvas.height = 500

const ball = {
  x:canvas.width / 2,
  y:canvas.height - 50,
  width: 10,
  height: 10,
  speed: 200,
  angle: Math.PI / 4 + Math.random() * Math.PI / 2
}

const platforma = {
  x:10,
  y:canvas.height - 30,
  width: 200,
  height: 20,
  speed: 200,
  leftKey: false,
  rightKey: false
}

const blocks = [
  {x: 50, y: 50, width: 50, height: 20},
  {x: 100, y: 50, width: 50, height: 20},
  {x: 150, y: 50, width: 50, height: 20},
  {x: 200, y: 50, width: 50, height: 20},
  {x: 250, y: 50, width: 50, height: 20},

]

const limits = [
  {x: 0, y: -20, width: canvas.width, height: 20},
  {x: canvas.width, y: 0, width: 20, height: canvas.height},
  {x: 0, y: canvas.height, width: canvas.width, height: 20},
  {x: -20, y: 0, width: 20, height: canvas.height},
]

document.addEventListener("keydown", function (event) {
  if (event.key === 'ArrowLeft') {
    platforma.leftKey = true
  }
  else if (event.key === 'ArrowRight') {
    platforma.rightKey = true
  }
})

document.addEventListener("keyup", function (event) {
  if (event.key === 'ArrowLeft') {
    platforma.leftKey = false
  }
  else if (event.key === 'ArrowRight') {
    platforma.rightKey = false
  }
})

requestAnimationFrame (loop)

let pTimestamp = 0

function loop (timestamp) {
  requestAnimationFrame(loop)

  const dTimestamp = timestamp - pTimestamp
  const secondPart = dTimestamp / 1000
  pTimestamp = timestamp

  clearCanvas()
  
  ball.x += secondPart * ball.speed * Math.cos(ball.angle)
  ball.y -= secondPart * ball.speed * Math.sin(ball.angle)

  if (platforma.leftKey) {
    platforma.x = Math.max(0, platforma.x - secondPart * platforma.speed)
  }
  else if (platforma.rightKey) {
    platforma.x = Math.min(canvas.width - platforma.width, platforma.x + secondPart * platforma.speed)
  }

  for (const block of blocks) {
    if (isIntersaction(block, ball)){
      toggleItem(blocks, block)

      const ctrl1 = {
        x: block.x - 10,
        y: block.y - 10,
        width: 10 + block.width,
        height: 10 + block.height
      }
      const ctrl2 = {
        x: block.x + block.width,
        y: block.y - 10,
        width: 10 ,
        height: 10 + block.height
      }
      const ctrl3 = {
        x: block.x,
        y: block.y + block.height,
        width: block.width + 10,
        height: 10 
      }
      const ctrl4 = {
        x: block.x -10,
        y: block.y,
        width: 10 ,
        height: 10 + block.height
      }

      if (isIntersaction(ctrl1, ball) || (ctrl3, ball)) {
          ball.angle = Math.PI * 2 - ball.angle
      }
      else if (isIntersaction (ctrl, ball) || (ctrl4, ball)) {
          ball.angle = Math.PI - ball.angle
      }
    }
  }

  if (isIntersaction(limits[0], ball) || isIntersaction(limits[2], ball)) {
    ball.angle = Math.PI * 2 - ball.angle
  }

  if (isIntersaction(limits[1], ball) || isIntersaction(limits[3], ball)) {
    ball.angle = Math.PI - ball.angle
  }

  if (isIntersaction(platforma, ball)) {
    ball.angle = Math.PI * 2 - ball.angle
  }

  drawRect(ball)

  for (const block of blocks) {
    drawRect(block)
  }

  drawRect(platforma)
}

function clearCanvas () {
  canvas.width |= 0
  //размер не меняется - при движении не оставляет следов
}

function drawRect (param) {
  context.beginPath()
  //новая геометричесая фигура
  context.rect(param.x, param.y, param.width, param.height)
  //берем параметры для этого объекта - помечаем
  context.strokeStyle = "black"
  context.stroke()
}

function isIntersaction (blockA, blockB) {
  const pointsA = [
    {x: blockA.x, y: blockA.y},
    {x: blockA.x + blockA.width, y: blockA.y},
    {x: blockA.x, y: blockA.y + blockA.height},
    {x: blockA.x + blockA.width, y: blockA.y + blockA.height},
  ]

  for (const pointA of pointsA) {
    if (blockB.x <= pointA.x && pointA.x <= blockB.x + blockB.width && blockB.y <= pointA.y && pointA.y <= blockB.y + blockB.height) {
      return true
    }
  }

  const pointsB = [
    {x: blockB.x, y: blockB.y},
    {x: blockB.x + blockB.width, y: blockB.y},
    {x: blockB.x, y: blockB.y + blockB.height},
    {x: blockB.x + blockB.width, y: blockB.y + blockB.height},
  ]

  for (const pointB of pointsB) {
    if (blockA.x <= pointB.x && pointB.x <= blockA.x + blockA.width && blockA.y <= pointB.y && pointB.y <= blockA.y + blockA.height) {
      return true
    }
  }
  return false
}

function toggleItem (array, item) {
  if (array.includes(item)) {
    const index = array.indexOf(item)
    array.splice(index, 1)
  }
}