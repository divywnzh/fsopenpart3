const express = require('express')
const app = express()

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

const cors = require('cors')
app.use(cors())
app.use(express.json())

const morgan = require('morgan')

morgan.token('data',(request)=>{
    if(request.method==='POST'){
        return JSON.stringify(request.body)
    }
    return '';
})

const customform=(tokens,request,response)=>{
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens['response-time'](request, response) + ' ms',
        tokens.data(request, response) // Include body only if it is available
      ].join(' ');
}

app.use(morgan(customform));

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
    response.json(person)
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
  