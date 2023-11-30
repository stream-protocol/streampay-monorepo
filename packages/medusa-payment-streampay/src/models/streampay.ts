class StreamPayTransaction {
    id: string;
    amount: number;
    currency: string;
    // ... other relevant fields ...

    constructor(id: string, amount: number, currency: string) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
        // ... initialize other fields ...
    }

    // ... additional methods related to the StreamPay transaction ...
}

export { StreamPayTransaction };
