const express = require('express')

const server = express()

const Projects = []
let Requests = 0

server.use(express.json())

server.use((req, res, next) => {
  Requests++

  next()

  return console.log(`${Requests} requests since the start.`)
})

const CheckIfProjectExists = (req, res, next) => {
  const { id } = req.params
  if (Projects.findIndex(x => x.id == id) == -1) {
    return res.status(404).send('Project not found.')
  }

  return next()
}

server.get('/projects', (req, res) => {
  return res.json(Projects)
})

server.post('/projects', (req, res) => {
  const { id, title } = req.body

  Projects.push({ id, title, tasks: [] })

  return res.json(Projects[Projects.length - 1])
})

server.put('/projects/:id', CheckIfProjectExists, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const index = Projects.findIndex(x => x.id == id)

  Projects[index].title = title

  return res.json(Projects[index])
})

server.delete('/projects/:id', CheckIfProjectExists, (req, res) => {
  const { id } = req.params

  const index = Projects.findIndex(x => x.id == id)

  Projects.splice(index, 1)

  return res.send(`Project ${index} Deleted`)
})

server.post('/projects/:id/tasks', CheckIfProjectExists, (req, res) => {
  const { title } = req.body
  const { id } = req.params

  const index = Projects.findIndex(x => x.id == id)

  Projects[index].tasks.push({ id: Projects[index].tasks.length, title })

  return res.json(Projects[index])
})

server.listen(3000)
