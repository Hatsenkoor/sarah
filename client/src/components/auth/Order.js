import React, { Component }  from 'react';
import {useState, useEffect} from 'react';
import QRcode from 'qrcode.react';

export default function Order(){

    const [products, setProducts] = useState();
    const [qrcode, setQrcode] = useState(false);
    useEffect(() => {
        const fetchProducts = async () => {
            const productsData = await fetch('/get-products').then(res => res.json());
            setProducts(productsData.data);
        }
        fetchProducts();
    }, []);

    const ProductsDisplay = () => {
        const handleClick = () => {
            setQrcode(true);
        }
        return( products?
            (<div className = "order">
                {
                    products.map(product  => {
                        return(
                            <div className = "product" key = {product.id}>
                                <h2>{product.name}</h2>
                            </div>
                        );                        
                    })
                }
                <button onClick = {handleClick}>Order with QR code</button>
            </div>) : <p className="loading-msg">Loading...</p>
        );
    }

    const QrcodeDisplay = () => {
        const qrCodeDestination = `${window.location.origin}/checkout`;
        console.log(window.location.origin);
        return (<div>
                    <QRcode 
                        value = {qrCodeDestination}
                        size = {350}
                        includeMargin = {true}
                    />                   
                </div>
        );
    }
    return <QrcodeDisplay />
    
}
