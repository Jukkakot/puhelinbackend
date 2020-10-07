const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
"mongodb+srv://fullstack:"+password+"@cluster0.qe7r1.mongodb.net/person-app?retryWrites=true&w=majority"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  nimi:String,
  numero:String
})

const Person = mongoose.model('Person', personSchema)
if(process.argv[3] && process.argv[4]){
    const person = new Person({
        nimi:process.argv[3],
        numero:process.argv[4]
      })
      
      person.save().then(response => {
          console.log("added "+response.nimi+" "+response.numero+" to phonebook")
        mongoose.connection.close()
      })
} else {
    Person
    .find({})
    .then(persons => {
        console.log("phonebook:")
        persons.forEach(person => {
          console.log(person.nimi+" "+person.numero)
        })
        mongoose.connection.close()
      })
}
