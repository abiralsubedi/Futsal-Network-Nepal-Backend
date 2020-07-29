const { Router } = require("express");
const router = Router();
const bodyParser = require("body-parser");
const { requireLogin } = require("../../config/passport");

const { STRIPE_SECRET_KEY, STRIPE_ENDPOINT_SECRET } = process.env;

const stripe = require("stripe")(STRIPE_SECRET_KEY);

router.post("/create-payment-intent", requireLogin, async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { integration_check: "accept_a_payment" },
      receipt_email: "abiralsubedi119@gmail.com"
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/webhooks", async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      STRIPE_ENDPOINT_SECRET
    );

    switch (event.type) {
      case "payment_intent.succeeded": {
        console.log(event.data.object, "in webhooks");
        res.json({ message: "success", success: true });
        break;
      }

      default:
        return res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(409).json({ message: error.message });
  }
});

module.exports = router;
