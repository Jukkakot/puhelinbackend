  require('dotenv').config()
  const express = require('express')
  const Person = require('./models/person')
  const app = express()
  var morgan = require('morgan')
  app.use(express.static('build'))
  app.use(express.json()) 
  morgan.token('body', (req, res) => JSON.stringify(req.body))
  app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'));
  const cors = require('cors')
  app.use(cors())
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  app.get('/info', (req, res) => {
    Person.find().then(person=> {
      res.send("Phonebook has info for "+person.length+" people <br>"+new Date)
    })
  })
  
  app.get('/api/persons', (request, response) => {
    Person.find().then(person=> {
      response.json(person)
    })
  })
  
  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
      .then(person => {
        if(person){
          response.json(person)
        } else {
          response.status(400).send({ error: 'malformatted id' })
        }
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
  })
  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
    /*
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
    */
  })
  
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
    /*
    if(persons.find(person => person.name === body.name)){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }*/ 
    const person = new Person({
        name: body.name,
        number:body.number
      })
    person.save().then(savedPerson=> {
      response.json(savedPerson)
    })
  })

