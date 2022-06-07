const route = require("express").Router();
const axios = require("axios");

const { Checkout } = require("checkout-sdk-node");
const cko = new Checkout("Bearer sk_sbox_shrxf33xu54rohjchz4rawo7l4h");
const SK = "Bearer sk_sbox_shrxf33xu54rohjchz4rawo7l4h";
const API = "https://api.sandbox.checkout.com/";

route.post("/payWithToken", async (req, res) => {
  const payment = await cko.payments.request({
    source: {
      token: req.body.token
    },
    currency: "EUR",
    amount: 2000, // pence
    reference: "TEST-ORDER",
    processing_channel_id: "pc_c3p3ww7dbjleratlueom4zw4em"
  });
  res.send(payment);
});

route.get("/getIdealIssuers", async (req, res) => {
  console.log("Ideal Issuers Server");
  let issuers;
  try {
    issuers = await axios.get(
      "https://api.sandbox.checkout.com/ideal-external/issuers",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: SK
        }
      }
    );
    // console.log(issuers.data.countries[0].issuers.length);
    // console.log(issuers.data.countries);
    res.status(200).send(issuers.data);
  } catch (err) {
    res.status(500).send(err.response);
  }
});

route.post("/payWithIdeal", async (req, res) => {
  let issuer_id = req.body.issuer_id;
  let payment;
  payment = await cko.payments.request({
    source: {
      type: "ideal",
      bic: "INGBNL2A",
      description: "ORD50234E89",
      language: "nl"
    },
    amount: 2000,
    currency: "EUR",
    processing_channel_id: "pc_c3p3ww7dbjleratlueom4zw4em",
    success_url: req.body.url + "/success",
    failure_url: req.body.url + "/fail"
  });
  res.send(payment);
});

route.post("/payWithAPM", async (req, res) => {
  let option = req.body.option;
  console.log(option);
  let payment;
  if (option == "ideal") {
    payment = await cko.payments.request({
      source: {
        type: "ideal",
        bic: "INGBNL2A",
        description: "ORD50234E89",
        language: "nl"
      },
      currency: "EUR",
      amount: 2000, // pence
      success_url: req.body.url + "/success",
      failure_url: req.body.url + "/fail"
    });
  } else if (option == "sofort") {
    payment = await cko.payments.request({
      source: {
        type: "sofort"
      },
      currency: "EUR",
      amount: 2000, // pence
      success_url: req.body.url + "/success",
      failure_url: req.body.url + "/fail"
    });
  } else if (option == "p24") {
    payment = await cko.payments.request({
      source: {
        type: "p24",
        payment_country: "PL",
        account_holder_name: "Bruce Wayne",
        account_holder_email: "bruce@wayne-enterprises.com",
        billing_descriptor: "P24 Demo Payment"
      },
      currency: "PLN",
      amount: 200, // pence
      success_url: req.body.url + "/success",
      failure_url: req.body.url + "/fail"
    });
  } else if (option == "giropay") {
    payment = await cko.payments.request({
      source: {
        type: "giropay",
        purpose: "Mens black t-shirt L"
      },
      currency: "EUR",
      amount: 2000, // pence
      success_url: req.body.url + "/success",
      failure_url: req.body.url + "/fail"
    });
  } else if (option == "paypal") {
    payment = await cko.payments.request({
      source: {
        type: "paypal",
        invoice_number: "CKO0340001"
      },
      currency: "EUR",
      amount: 2000, // pence
      success_url: req.body.url + "/success",
      failure_url: req.body.url + "/fail"
    });
  }
  res.send(payment);
});

// Get payment details by cko-session-id
route.post("/getPaymentBySession", async (req, res) => {
  const details = await cko.payments.get(req.body.sessionId);
  res.send(details);
});

//KLARNA
//

module.exports = route;
