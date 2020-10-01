  const express = require('express')
  const app = express()
  var morgan = require('morgan')
  app.use(express.static('build'))
  app.use(express.json()) 
  morgan.token('body', (req, res) => JSON.stringify(req.body))
  app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'));
  const cors = require('cors')
    app.use(cors())
    let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
        },
        { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
        },
        { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
        },
        { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
        },
        { 
        "name": "Jukka Kotilainen", 
        "number": "123 123123123",
        "id": 5
        }
        ]

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  app.get('/info', (req, res) => {
    res.send('Phonebook has info for '+persons.length+" people <br>"+new Date)
  })
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
  })
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  /*
  app.put('/api/persons/:id', function (request, response) {
    const body = request.body
    const id = Number(request.params.id)
    if (!body) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }else if(!body.name){
        return response.status(400).json({ 
            error: 'person name missing' 
          })
    }else if(!body.number){
        return response.status(400).json({ 
            error: 'person number missing' 
          })
    }
    const person = persons.find(person => person.id === id)
    person.number = body.number
    
    response.json(person)
  })
  */
  app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }else if(!body.name){
        return response.status(400).json({ 
            error: 'person name missing' 
          })
    }else if(!body.number){
        return response.status(400).json({ 
            error: 'person number missing' 
          })
    }
    if(persons.find(person => person.name === body.name)){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
    const person = {
        name: body.name,
        number:body.number,
        id: Math.floor(Math.random() * 50000)
      }
    persons = persons.concat(person)

    response.json(person)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })