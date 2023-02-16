import { Container, Form, Button, Spinner } from 'react-bootstrap'
import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../components/AppContext.js'
import { userCreate, guestCreate } from '../http/orderAPI.js'
import { fetchBasket } from '../http/basketAPI.js'
import { check as checkAuth } from '../http/userAPI.js'
import { Navigate } from 'react-router-dom'
import { Payment } from "../components/Payment.js";

const isValid = (input) => {
    let pattern
    switch (input.name) {
        case 'name':
            pattern = /^[-а-я]{2,}( [-а-я]{2,}){1,2}$/i
            return pattern.test(input.value.trim())
        case 'email':
            pattern = /^[-_.a-z]+@([-a-z]+\.){1,2}[a-z]+$/i
            return pattern.test(input.value.trim())
        case 'phone':
            pattern = /^\+375(17|29|33|44)[0-9]{7}$/i
            return pattern.test(input.value.trim())
        case 'address':
            return input.value.trim() !== ''
    }
}

const Checkout = () => {
    const { user, basket } = useContext(AppContext)
    const [fetching, setFetching] = useState(true) 

    const [order, setOrder] = useState(null)

    const [value, setValue] = useState({name: '', email: '', phone: '', address: ''})
    const [valid, setValid] = useState({name: null, email: null, phone: null, address: null})

    useEffect(() => {
       
        fetchBasket()
            .then(
                data => basket.products = data.products
            )
            .finally(
                () => setFetching(false)
            )
        
        checkAuth()
            .then(data => {
                if (data) {
                    user.login(data)
                }
            })
            .catch(
                error => user.logout()
            )
    }, [])

    if (fetching) { 
        return <Spinner animation="border" />
    }

    if (order) { 
        return (
            <Container>
                <h1 className="mb-4 mt-4">Заказ оформлен</h1>
                <p>Наш менеджер скоро позвонит для уточнения деталей.</p>
            </Container>
        )
    }

    const handleChange = (event) => {
        setValue({...value, [event.target.name]: event.target.value})
        
        setValid({...valid, [event.target.name]: isValid(event.target)})
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        setValue({
            name: event.target.name.value.trim(),
            email: event.target.email.value.trim(),
            phone: event.target.phone.value.trim(),
            address: event.target.address.value.trim(),
        })

        setValid({
            name: isValid(event.target.name),
            email: isValid(event.target.email),
            phone: isValid(event.target.phone),
            address: isValid(event.target.address),
        })

        if (valid.name && valid.email && valid.phone && valid.address) {
            let comment = event.target.comment.value.trim()
            comment = comment ? comment : null
            
            const body = {...value, comment}
            const create = user.isAuth ? userCreate : guestCreate
            create(body)
                .then(
                    data => {
                        setOrder(data)
                        basket.products = []
                    }
                )
        }
    }

    return (
        <Payment />
    )
}

export default Checkout