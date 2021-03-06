require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
var morgan = require('morgan')
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
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
  Person.find().count({}, function( err, count){
    res.send("Phonebook has info for "+count+" people <br>"+new Date)
  })
})

app.get('/api/persons', (request, response,next) => {
  Person.find().then(person => {
    response.json(person)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      } else {
        response.status(400).send({ error: 'malformatted id' })
      }
    })
    .catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', function (request, response,next) {
  const body = request.body
  const id= request.params.id

  if (Object.keys(body).length === 0) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const person = {
    id:id,
    name:body.name,
    number:body.number
  }
  Person.findByIdAndUpdate(id,person ,{ new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})

app.post('/api/persons', (request, response,next) => {
  const body = request.body

  if (Object.keys(body).length === 0) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const person = new Person({
    name: body.name,
    number:body.number
  })
  person
    .save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

