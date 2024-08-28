const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
response.send('<h1>Phonebook Database</h1>')
})

app.get('/api/persons', (request, response) => {
response.json(persons)
})

app.get('/info', (request, response) => {
    response.send('<p>Phonebook has info for ' + persons.length + ' people</p><p>' +  new Date() + '</p>')
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if(person){
    response.send('<div><h2>Person Details</h2><p> Name: ' + person.name + '</p> Contact: '+ person.number +'<p>' + '</p></div>')
  }else{
    response.status(404).json({error: "No such person exists in the database"})
  }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateId = () =>{
    const id=Math.floor(Math.random() * 100000);
    return String(id)
}

app.post('/api/persons/',(request,response)=>{
    const body=request.body
    if(!body.name){
        return response.status(400).json({ 
            error: 'name missing' 
          })
    }
    if(!body.number){
        return response.status(400).json({ 
            error: 'number missing' 
          })
    }
    if(persons.find(p=>p.name===body.name)){
        return response.status(409).json({ 
            error: 'The name already exists in the phonebook' 
          })
    }

    const person={id:generateId(), name:body.name, number:body.number }
    persons=persons.concat(person)
    response.json(person)  
})

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
  