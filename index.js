
  const express = require('express')
  const app = express()
  app.use(express.json()) 
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
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    
    if (!body) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id)) 
        : 0
    const person = {
        name: body.name,
        number:body.number,
        id: maxId+1
      }
    persons = persons.concat(person)

    response.json(person)
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })