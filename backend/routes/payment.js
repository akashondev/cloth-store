// import express from "express";
// import Stripe from "stripe";
// import dotenv from "dotenv";
// dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// app.use(cors({ origin: process.env.CLIENT_URL}));

// //api to create checkout session

// app.post("/create-chekout-session", async(req,res)=>{
//     try {
//         const {product} = req.body;
        
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "usd",
//                         product_data: {
//                             name: product.name,
//                             images: [product.image],
//                         },
//                         unit_amount: product.price * 100,
//                     },
//                     quantity:1,
//                 }
//             ],
//             mode:"payment",
//             success_url: `${process.env.CLIENT_URL}/success`,
//             cancel_url: `${process.env.CLIENT_URL}/cancel`
//         })
//         res.json({url: session.url});  
//     } catch (error){
//         res.status(500).json({error: error.message});
//     }
// })

// export default app;