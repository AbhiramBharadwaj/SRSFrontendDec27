import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'

const Test = () =>{
    const [allBookings, setAllBookings] = useState([]);

    useEffect(()=>{
       const fetch = async() =>{
         const res = await axios.get("http://localhost:3000/api/bookings/list");
        setAllBookings(res.data.bookings);
        console.log(res.data)
        // alert("data fetched successfully..!")
       }
       fetch();
    }, []);
    const handlePayment = async ()=>{
        try{
            const responce1 =  await axios.post('http://localhost:3000/api/bookings/create', {
                amount:2000
            })
            console.log(responce1);
            const bookingId = responce1.data.bookingData.bookingId;
            const amount = responce1.data.bookingData.amount;
            const responce2 = await axios.post('http://localhost:3000/api/bookings/initialize/payment', {
                bookingId,
                amount
            })

            console.log(responce2);


            const script = document.createElement("script");
            script.src=  "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () =>{
                const razorpay = new window.Razorpay({
                    key:responce2.data.key,
                    amount:responce2.data.amount,
                    currency:'INR',
                    order_id:responce2.data.orderID,
                    name:"testing app",
                    description:"testing the razor pay intigration",
                    theme: { color: 'blue' },
                    handler: async(res) =>{
                        console.log(res);
                        try {
                            const responce3 = await axios.post("http://localhost:3000/api/bookings/verify/payment",{
                                orderId:res.razorpay_order_id,
                                paymentId:res.razorpay_payment_id,
                                signature:res.razorpay_signature,
                                bookingId
                            })
                                console.log(responce3);

                        } catch (error) {
                            console.log(error)
                        }
                    }

                })
                        razorpay.open();

            }

            document.body.appendChild(script);

        }catch(err){
            console.log(err);
        }
    }
    
    return(
        <Fragment>
            <center>
                <button onClick={handlePayment} className=' p-2 mt-18  rounded-md bg-gray-900 text-white hover:bg-gray-700'>Pay &#8377; 2000/-</button>
            </center>
            <hr />

            <table border width="100%" cellSpacing="0" cellpadding="15" style={{textAlign:'center'}} >
                <tr>
                    <th>SI.No</th>
                    <th>Booking Id</th>
                    <th>Order Id</th>
                    <th>Status</th>
                </tr>
                {
                    allBookings.map((item, index)=>(
                        <tr key={index} className='text-center'>
                            <td>{index+1}</td>
                            <td>{item.bookingId}</td>
                            <td>{item.orderId}</td>
                            <td>
                                <span className={`${item.status=="pending"?"text-red-800 bg-red-100 p-1 px-3 rounded-md":"text-green-800 bg-green-100 p-1 px-3 rounded-md"}`}>{item.status}</span>
                            </td>
                        </tr>
                    ))
                }
            </table>
        </Fragment>
    )
}
export default Test;