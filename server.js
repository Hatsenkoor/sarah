const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const users = require("./routes/api/users");
const domains = require("./routes/api/domains");

const app = express();

// const cors = require('cors');
// const corsOptions ={
//     origin:'http://127.0.0.1:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   if (req.method === 'OPTIONS') {
//       res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
//       return res.status(200).json({});
//   }
//   next();
// });
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
// mongoose
//   .connect(
//     db,
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log("MongoDB successfully connected"))
//   .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/domains", domains);

app.get("/configstripe", async (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
});

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: 'price_1JySFCBnTsUY3iut42jqi4Eo',
            quantity: 1,
            adjustable_quantity: {
              enabled: true,
              maximum: 5
            }
          }
        ],
        mode: 'payment',
        success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.DOMAIN}/cancel`
    });
    res.json({id: session.id});
})

app.get('/checkout-session', async (req, res) => {
    const {sessionId} = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
       expand: ['payment_intent']
    });
    res.send(session);
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
