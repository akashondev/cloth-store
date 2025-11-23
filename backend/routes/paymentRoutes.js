import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



// Create checkout session for multiple products
router.post("/create-chekout-session", async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "products array is required" });
    }

    // Convert products → Stripe line_items
    const lineItems = products.map((p) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: p.title,
          images: p.images,
        },
        unit_amount: p.price * 100,
      },
      quantity: p.qty || 1, // support multiple quantities
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;



//https://checkout.stripe.com/c/pay/cs_test_a1IHseULYCtUEGb90kFRC8sogMXFaE8ItR9vX1a5QLlHBJ9KAMXiJ23qba#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdkdWxOYHwnPyd1blpxYHZxWjA0VlJGf39HSD1OSk1BUkNhajxCNnd8Q0BIY2c3Z088d0g8QnNPRmlxM1d0Z2k2bm02fWxWSjJXT1Rxf0NzVW1DY2wzTmJgNkFudktxaFJnaG89SHc0PH1pNTVqbmdcPDVRbicpJ2N3amhWYHdzYHcnP3F3cGApJ2dkZm5id2pwa2FGamlqdyc%2FJyZjY2NjY2MnKSdpZHxqcHFRfHVgJz8ndmxrYmlgWmxxYGgnKSdga2RnaWBVaWRmYG1qaWFgd3YnP3F3cGB4JSUl

//http://localhost:5000/payment/create-chekout-session


// {
//   "products": [
//     {
//       "_id": "6909f3a1301ebeadb0a3ef5f",
//       "title": "Casual Button-Down Shirt",
//       "price": 1299,
//       "category": "Clothing",
//       "description": "Lightweight button-down shirt suitable for casual and semi-formal occasions.",
//       "images": [
//         "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRoNKGOUcHtvuIXQ8y-fCfi54oybpp9J2VfC_y9XzNuoqKbBVve1TU9yicXbJMh4bAqvJSxtGqukkrVWcQAmibTOV04Nzx3ahcp0ZxlOkZe"
//       ],
//       "qty": 1
//     }
//   ]
// }