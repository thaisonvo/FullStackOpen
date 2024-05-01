const PersonForm = ({ addNewPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addNewPerson}>
      <div>name: <input value={newName} onChange={handleNameChange}></input></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange}></input></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

export default PersonForm