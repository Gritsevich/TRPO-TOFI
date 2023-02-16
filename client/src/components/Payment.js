import { Spinner } from 'react-bootstrap'
import { useContext, useEffect, useState } from "react";
import { AppContext } from './AppContext.js'

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { fetchStripeConfig, createPayment } from "../http/stripeAPI";

function Payment() {
  const { basket } = useContext(AppContext)
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null)
  const [fetching, setFetching] = useState(true) 


  useEffect(() => {

    fetchStripeConfig()
        .then(async (data) => {
                const { publishableKey } = await data;
                setStripePromise(loadStripe(publishableKey))
            }
        ).catch(
                error => setError(error.response.data.message)
        ).finally(
            () => setFetching(false)
        )
  }, []);

  useEffect(() => {
    const body = { amount: basket.sum.toString() + "00" }
    createPayment(body)
        .then(async (data) => {
            var { clientSecret } = await data;
            setClientSecret(clientSecret);
        })
        .catch(
            error => alert(error.response.data.message)
        ).finally(
            () => setFetching(false)
        )
  }, []);

    if (fetching) { 
        return <Spinner animation="border" />
    }

    if (error) {
        return <p>{error}</p>
    }

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export { Payment };