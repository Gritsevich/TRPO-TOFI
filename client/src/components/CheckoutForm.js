import { Container, Form, Button, Spinner } from 'react-bootstrap'
import { AppContext } from '../components/AppContext.js'
import { userCreate, guestCreate } from '../http/orderAPI.js'
import { fetchBasket } from '../http/basketAPI.js'
import { check as checkAuth } from '../http/userAPI.js'
import { Navigate } from 'react-router-dom'
import { Payment } from "../components/Payment.js";
import { useState, useContext, useEffect } from 'react'

import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";

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

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const { user, basket } = useContext(AppContext)
    const [fetching, setFetching] = useState(true) 

    const [order, setOrder] = useState(null)

    const [isSucceeded, setIsSucceeded] = useState(false);

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

    const handleChange = (e) => {
        setValue({...value, [e.target.name]: e.target.value})
        
        setValid({...valid, [e.target.name]: isValid(e.target)})
    }

  const handleSubmit = async (e) => {

      e.preventDefault()

        setValue({
            name: e.target.name.value.trim(),
            email: e.target.email.value.trim(),
            phone: e.target.phone.value.trim(),
            address: e.target.address.value.trim(),
        })

        setValid({
            name: isValid(e.target.name),
            email: isValid(e.target.email),
            phone: isValid(e.target.phone),
            address: isValid(e.target.address),
        })

        if (valid.name && valid.email && valid.phone && valid.address) {
            let comment = e.target.comment.value.trim()
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

    if (!stripe || !elements) {
      return;
    }

    if(!order){
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      });

      if( error){
        alert(error.message)
      } else if( paymentIntent && paymentIntent.status == 'succeeded' ){
        setIsSucceeded(true)
        return
      }
      setIsSucceeded(false)
    }
  };

  return isSucceeded? (
            <Container>
                <h1 className="mb-4 mt-4">Заказ оформлен</h1>
                <p>Наш менеджер скоро позвонит для уточнения деталей.</p>
            </Container>  
      ):
      (
     <Container>
            {basket.count === 0 && <Navigate to="/basket" replace={true} />}
            <h1 className="mb-4 mt-4">Оформление заказа</h1>
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Control
                    name="name"
                    value={value.name}
                    onChange={e => handleChange(e)}
                    isValid={valid.name === true}
                    isInvalid={valid.name === false}
                    placeholder="Введите имя и фамилию..."
                    className="mb-3"
                />
                <Form.Control
                    name="email"
                    value={value.email}
                    onChange={e => handleChange(e)}
                    isValid={valid.email === true}
                    isInvalid={valid.email === false}
                    placeholder="Введите адрес почты..."
                    className="mb-3"
                />
                <Form.Control
                    name="phone"
                    value={value.phone}
                    onChange={e => handleChange(e)}
                    isValid={valid.phone === true}
                    isInvalid={valid.phone === false}
                    placeholder="Введите номер телефона..."
                    className="mb-3"
                />
                <Form.Control
                    name="address"
                    value={value.address}
                    onChange={e => handleChange(e)}
                    isValid={valid.address === true}
                    isInvalid={valid.address === false}
                    placeholder="Введите адрес доставки..."
                    className="mb-3"
                />
                <Form.Control
                    name="comment"
                    className="mb-3"
                    placeholder="Комментарий к заказу..."
                />
                 <PaymentElement id="payment-element"
                 className="mb-3" />
                <Button type="submit">Отправить</Button>
            </Form>
        </Container>
  );
}