const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.wktov.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Note = mongoose.model('Note', personSchema)

if (process.argv > 3) {
const person = new Note({
  name: process.argv[3],
  number: process.argv[4]
}) 

person.save().then(response => {
  console.log(`added ${response.name} number ${response.number} to the phonebook` )
  mongoose.connection.close()
})
}
else {
    console.log('Phonebook:')
    Note.find({}).then(result => {
        result.forEach(note => {
            console.log(note.name, note.number)
        })
        mongoose.connection.close()
    })
}
  