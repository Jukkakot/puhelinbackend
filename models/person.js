const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.MONGODB_URI
//const url = "mongodb+srv://fullstack:"+password+"@cluster0.qe7r1.mongodb.net/person-app?retryWrites=true&w=majority"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name:String,
    number:String
  })
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)