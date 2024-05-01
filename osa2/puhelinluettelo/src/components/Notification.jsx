const Notification = ({ message, type }) => {
  if (!message) {
    return null
  }

  const notifStyle = {
    color: type !== 'error' ? 'green' : 'red',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={notifStyle}>
      {message}
    </div>
  )
}

export default Notification