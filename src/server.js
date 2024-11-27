const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const TAP_SECRET_KEY = 'sk_test_ParN2MZDGgdbkqLcmIuznVTH'; // Replace with your Tap secret key

// Endpoint to create a payment request
app.post('/create-payment', async (req, res) => {
    const { amount, currency, customer } = req.body;

    try {
        const response = await axios.post(
            'https://api.tap.company/v2/charges',
            {
                amount,
                currency,
                threeDSecure: true,
                save_card: false,
                description: 'Payment description',
                customer,
                source: {
                    id: 'src_all',
                },
                redirect: {
                    url: 'getglowcustomer://tabs/tab1', // Frontend success page
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${TAP_SECRET_KEY}`,
                },
            }
        );

        res.status(200).send(response.data);
    } catch (error) {
        console.error(error.response.data);
        res.status(500).send({ error: error.response.data });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
