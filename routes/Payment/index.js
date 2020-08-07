const { Router } = require("express");
const router = Router();
const { requireLogin } = require("../../config/passport");
const User = require("../../models/User");
const CreditHistory = require("../../models/CreditHistory");

const { STRIPE_SECRET_KEY, STRIPE_ENDPOINT_SECRET } = process.env;

const stripe = require("stripe")(STRIPE_SECRET_KEY);

router.post("/create-payment-intent", requireLogin, async (req, res) => {
  try {
    const { amount, currency, emailAddress } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { integration_check: "accept_a_payment" },
      receipt_email: emailAddress
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
        const { receipt_email, amount, created } = event.data.object;

        const emailAddress = receipt_email || "bishal+teacher@innovatetech.co";
        const receivedAmount = amount / 100;

        await User.updateOne(
          { emailAddress },
          { $inc: { credit: receivedAmount } }
        );

        const user = await User.findOne({ emailAddress });

        if (user) {
          const newCreditTransaction = new CreditHistory({
            user: user._id,
            transactionDate: new Date(created * 1000),
            remark: "Credit top up with Stripe.",
            amount: receivedAmount
          });

          await newCreditTransaction.save();
        }

        res.json({
          message: "success",
          success: true,
          receivedAmount,
          emailAddress,
          newCreditTransaction
        });
        break;
      }

      default:
        return res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

module.exports = router;
