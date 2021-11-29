import React, { Component }  from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Success(){
    
    // const [ session, setSession ] = useState[null];
    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let sessionId = useQuery().get("session_id");

    // useEffect(() => {
    //     const fetchSessionData = async () => {
    //         let response = await fetch('/checkout-session?sessionId=' + sessionId);
    //         let sessionData = await response.json();
    //         setSession(sessionData);
    //     }
    //     fetchSessionData();
    // }, [sessionId]);

    // return <section>
    //             <h2 className = "success-msg">Your order will be ready soon!</h2>
    //             {
    //                 session && (
    //                     <Link to = {{pathname: session.payment_intent.charges.data[0].receipt_url}} target="_blank">
    //                         <button type="link">View Receipt</button>
    //                     </Link>                    
    //                 )
    //             }
    //        </section>
}

