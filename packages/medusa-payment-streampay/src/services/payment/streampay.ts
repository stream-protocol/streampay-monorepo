import axios from "axios";
import { PaymentService } from "medusa-interfaces";
import { MedusaError, Logger } from "medusa-core-utils";
// Include other necessary imports

class StreamPayService extends PaymentService {
    private apiKey: string;
    private apiBase: string;

    constructor(apiKey: string, apiBase: string = "https://api.streampayments.org") {
        super();
        this.apiKey = apiKey;
        this.apiBase = apiBase;
    }

    // Method to create a payment session with StreamPay
    async createPaymentSession(cart, paymentMethods, returnUrl, cancelUrl) {
        try {
            const data = {
                // Structure the data as required by StreamPay API
                cart,
                paymentMethods,
                returnUrl,
                cancelUrl,
            };

            const response = await axios.post(`${this.apiBase}/create-payment-session`, data, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data; // The response structure depends on StreamPay's API
        } catch (error) {
            Logger.error(`Error creating StreamPay payment session: ${error}`);
            throw new MedusaError(MedusaError.Types.UNEXPECTED_ERROR, "Failed to create payment session.");
        }
    }

    // Other methods for handling payments, refunds, etc.

    // Utility method to handle API requests to StreamPay
    async apiRequest(endpoint, method, data) {
        try {
            const response = await axios({
                url: `${this.apiBase}/${endpoint}`,
                method: method,
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                data: data,
            });
            return response.data;
        } catch (error) {
            Logger.error(`Error in StreamPay API request: ${error}`);
            throw new MedusaError(MedusaError.Types.UNEXPECTED_ERROR, "StreamPay API request failed.");
        }
    }

    // ... Additional methods as needed ...
}

export default StreamPayService;
