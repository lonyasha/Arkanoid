const canvas = document.querySelector('canvas')
//context - отрисовка 
const context = canvas.getContext('2d')

canvas.width = 500
canvas.height = 500

// подгрузка изображения в js
let image = new Image
image.src = "image.png"

let space = new Image
space.src = "space.jpg"

const atlas =  {
  ball: { x: 64, y: 160, width: 16, height: 16 },
  blue: { x: 324, y: 44, width: 54, height: 22 },
  purple: { x: 540, y: 44, width: 54, height: 22 },
  red: { x: 594, y: 44, width: 54, height: 22 },
  yellow: { x: 648, y: 44, width: 54, height: 22 },
  platforma: { x: 134, y: 127, width: 90, height: 18 }
}

const ball = {
  x:canvas.width / 2,
  y:canvas.height - 50,
  width: 10,
  height: 10,
  speed: 200,
  angle: Math.PI / 4 + Math.random() * Math.PI / 2
}

const platforma = {
  x:canvas.width / 2 - 44,
  y:canvas.height - 30,
  width: 88,
  height: 15,
  speed: 200,
  leftKey: false,
  rightKey: false
}

const blocks = [
  {x: 50, y: 50, width: 50, height: 20, color: "blue"},
  {x: 100, y: 50, width: 50, height: 20, color: "purple"},
  {x: 150, y: 50, width: 50, height: 20, color: "red"},
  {x: 200, y: 50, width: 50, height: 20, color: "yellow"},
]

for (let x = 0; x < 8; x++) {
  for (let y = 0; y < 10; y++) {
    blocks.push ({
      x: 50 + 50 * x,
      y: 50 + 20 * y,
      width: 50,
      height: 20,
      color: getRandomFrom(["blue", "purple", "red", "yellow"])
    })
  }
}

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

  else if (plaing === false && event.key === 'Enter') {
    plaing = true
    Object.assign(ball, {
      x:canvas.width / 2,
      y:canvas.height - 50,
      width: 10,
      height: 10,
      speed: 200,
      angle: Math.PI / 4 + Math.random() * Math.PI / 2
    })
    
    Object.assign(platforma,{
      x:canvas.width / 2 - 44,
      y:canvas.height - 30,
      width: 88,
      height: 15,
      speed: 200,
      leftKey: false,
      rightKey: false
    })
    
    blocks.splice(0, blocks.length - 1)
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 10; y++) {
        blocks.push ({
          x: 50 + 50 * x,
          y: 50 + 20 * y,
          width: 50,
          height: 20,
          color: getRandomFrom(["blue", "purple", "red", "yellow"])
        })
      }
    }
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
let plaing = true

function loop (timestamp) {
  requestAnimationFrame(loop)

  clearCanvas()

  if (plaing) { 

    const dTimestamp = Math.min(16.7, timestamp - pTimestamp)
    const secondPart = dTimestamp / 1000
    pTimestamp = timestamp

    
    
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
          width: block.width + 10,
          height: 10
        }
        const ctrl2 = {
          x: block.x + block.width,
          y: block.y - 10,
          width: 10 ,
          height: block.height + 10
        }
        const ctrl3 = {
          x: block.x,
          y: block.y + block.height,
          width: block.width + 10,
          height: 10 
        }
        const ctrl4 = {
          x: block.x - 10,
          y: block.y,
          width: 10,
          height: block.height + 10
        }

        if (isIntersaction(ctrl1, ball) || (ctrl3, ball)) {
            ball.angle = Math.PI * 2 - ball.angle
        }
        else if (isIntersaction (ctrl, ball) || (ctrl4, ball)) {
            ball.angle = Math.PI - ball.angle
        }

        break

      }
    }

    if (isIntersaction(limits[0], ball)) {
      ball.angle = Math.PI * 2 - ball.angle
    }

    if (isIntersaction(limits[1], ball) || isIntersaction(limits[3], ball)) {
      ball.angle = Math.PI - ball.angle
    }

    if (isIntersaction(platforma, ball)) {
      const x = ball.x + ball.width / 2
      const percent = (x - platforma.x) / platforma.width
      ball.angle = Math.PI - Math.PI * 8 / 10 * percent
    }

    if (isIntersaction(limits[2], ball)) {
      plaing = false
    }
  }

  drawBall(ball)

  for (const block of blocks) {
    drawBlock(block)
  }

  drawPlatforma(platforma)

  if (!plaing) {
    drawResult ()
  }
}

function clearCanvas () {
  context.drawImage(space, 0, 0, image.width, image.height)
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

function drawBall (ball) {
  context.drawImage(
    image,
    //область вырезки
    atlas.ball.x, atlas.ball.y, atlas.ball.width, atlas.ball.height,
    ball.x, ball.y, ball.width, ball.height
  )
}

function drawBlock (block) {
  context.drawImage(
    image,
    //область вырезки
    atlas[block.color].x, atlas[block.color].y, atlas[block.color].width, atlas[block.color].height,
    block.x, block.y, block.width, block.height
  )
}

function drawPlatforma (platforma) {
  context.drawImage(
    image,
    //область вырезки
    atlas.platforma.x, atlas.platforma.y, atlas.platforma.width, atlas.platforma.height,
    platforma.x, platforma.y, platforma.width, platforma.height
  )
}

function getRandomFrom (array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function drawResult () {
  context.beginPath()
  context.rect(0, 0, canvas.width, canvas.height)
  context.fillStyle = "rgba(255, 255, 255, 0.5)"
  context.fill()

  context.fillStyle = "black"
  context.font = "50px Monaco"
  context.textAlign = "center"
  context.fillText("The End", canvas.width / 2, canvas.height / 2 - 50)

  context.fillStyle = "black"
  context.font = "30px Monaco"
  context.textAlign = "center"
  context.fillText("Press enter to continue", canvas.width / 2, canvas.height / 2 - 20)
}