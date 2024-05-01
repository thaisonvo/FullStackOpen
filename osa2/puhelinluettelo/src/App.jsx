import { useState, useEffect } from 'react'

import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/personServices'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(error => {
        setNotification({ message: 'Failed to retrieve initial persons', type: 'error' })
        console.log(error)
      })
  }, []) 
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const addNewPerson = (event) => {
    event.preventDefault()

    const personExists = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    if (personExists) {
      const confirmMessage = `${personExists.name} is already added to phonebook, replace the old number with a new one?`
      if (window.confirm(confirmMessage)) {
        const updatedData = { ...personExists, number: newNumber }
        personService
          .update(updatedData.id, updatedData)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson))

            setNotification({ message: `Successfully updated the number of ${updatedPerson.name}`, type: 'success' })
            setTimeout(() => {
              setNotification({ message: null, type: null })
            }, 5000)

            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setNotification({ message: `Information of ${updatedData.name} has already been deleted from server`, type: 'error' })
            setTimeout(() => {
              setNotification({ message: null, type: null })
            }, 5000)
            setPersons(persons.filter(person => person.id !== updatedData.id))
            console.log(error)
          })
      }
      return
    }
    
    const newPerson = { name: newName, number: newNumber }
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))

        setNotification({ message: `Successfully added ${newName}`, type: 'success' })
        setTimeout(() => {  
          setNotification({ message: null, type: null })
        }, 5000)

        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setNotification({ message: 'Failed to add a new entry', type: 'error' })
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
        console.log(error)
      })
  }

  const deletePerson = (id, person) => {
    if (window.confirm(`Delete ${person}?`)) {
      personService
        .remove(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification({ message: `Successfully deleted ${person}`, type: 'success' })
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 5000)
        })
        .catch(error => {
          setNotification({ message: `${person} has already been deleted from the server`, type: 'error' })
          setTimeout(() => {
            setNotification({ message: null, type: 'error' })
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
          console.log(error)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type}/>
      <h3>Add a new entry</h3>
      <PersonForm 
        addNewPerson={addNewPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App