import { useState, useEffect } from 'react'
import { fetchUsers, deleteUser } from '../http/userAPI.js'
import { Button, Container, Spinner, Table } from 'react-bootstrap'

const SuperAdminUsers = () => {
    const [users, setUsers] = useState(null) 
    const [fetching, setFetching] = useState(true) 
    const [show, setShow] = useState(false) 
    const [change, setChange] = useState(false)
   
    const [userId, setUserId] = useState(null)

    const handleDeleteClick = (id) => {
        deleteUser(id)
            .then(
                data => {
                    setChange(!change)
                    alert(`Пользователь «${data.email}» удален`)
                }
            )
            .catch(
                error => alert(error.response.data.message)
            )
    }

    useEffect(() => {
        fetchUsers()
            .then(
                data => setUsers(data)
            )
            .finally(
                () => setFetching(false)
            )
    }, [change])

    if (fetching) {
        return <Spinner animation="border" />
    }

    return (
        <Container>
            <h1>Пользователи</h1>
            {users.length > 0 ? (
                <Table bordered hover size="sm" className="mt-3">
                    <thead>
                        <tr>
                            <th>Почта пользователя</th>
                            <th>Удалить</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(item => 
                            <tr key={item.id}>
                                <td>{item.email}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(item.id)}>
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            ) : (
                <p>Список пользователей пустой</p>
            )}
        </Container>
    )
}

export default SuperAdminUsers