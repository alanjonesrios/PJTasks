const express = require('express')

const server = express()

const projects = []

server.use(express.json())

/**
 * Middleware que checa se o projeto existe
 */
const checkProjectExists = (req, res, next) => {
  const { id } = req.params
  if (projects.find(p => p.id == id)) {
    return res.status(400).send('Project not found.')
  }

  return next()
}

/**
 * Middleware que dá log no número de requisições
 */
const logRequests = (req, res, next) => {
  console.count('Número de requisições')

  return next()
}

server.use(logRequests)

/**
 * Retorna todos os projetos
 */
server.get('/projects', (req, res) => {
  return res.json(projects)
})

/**
 * Request body: id, title
 * Cadastra um novo projeto
 */
server.post('/projects', (req, res) => {
  const { id, title } = req.body

  projects.push({ id, title, tasks: [] })

  return res.json(projects[projects.length - 1])
})

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */
server.put('/projects/:id', CheckIfProjectExists, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const project = projects.find(x => x.id == id)

  project.title = title

  return res.json(project)
})

/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */
server.delete('/projects/:id', CheckIfProjectExists, (req, res) => {
  const { id } = req.params

  const index = projects.findIndex(x => x.id == id)

  projects.splice(index, 1)

  return res.send(`Project ${index} Deleted`)
})

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id;
 */
server.post('/projects/:id/tasks', CheckIfProjectExists, (req, res) => {
  const { title } = req.body
  const { id } = req.params

  const project = projects.find(x => x.id == id)

  project.tasks.push({ title })

  return res.json(project)
})

server.listen(3000)
