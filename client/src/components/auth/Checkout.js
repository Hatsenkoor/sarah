import React, { Component }  from 'react';
import {useEffect} from 'react';
import {loadStripe} from '@stripe/stripe-js';

export default function Checkout(){    
        useEffect(() => {
            instantiateCheckout();
        }, []);
        
        const instantiateCheckout = async () => {
            
            const { publishableKey } = await fetch('/configstripe').then(res => res.json());
            const stripe = await loadStripe(publishableKey);
    
            const { response } = await fetch('/create-checkout-session', {
                method: 'POST'
            });
            
            const { id: sessionId } = await response.json();

            const result = await stripe.redirectToCheckout({
                sessionId: sessionId
            });            
    
            if (result.error) {
                console.log("there was an error!");
            }
        }

        return <p className = "loading-msg">Loading...</p>
        
    
}


