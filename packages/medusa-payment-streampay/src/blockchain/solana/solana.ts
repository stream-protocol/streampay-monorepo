import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from "@solana/web3.js";

class SolanaClient {
    private connection: Connection;

    constructor(clusterUrl: string) {
        this.connection = new Connection(clusterUrl);
    }

    // Connects to the Solana network
    connect(): Connection {
        return this.connection;
    }

    // Retrieves the balance of a given Solana account
    async getBalance(publicKey: PublicKey): Promise<number> {
        return this.connection.getBalance(publicKey);
    }

    // Sends SOL from one account to another
    async sendSol(fromKeypair: Keypair, toPublicKey: PublicKey, amount: number): Promise<string> {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toPublicKey,
                lamports: amount * LAMPORTS_PER_SOL,
            }),
        );

        return sendAndConfirmTransaction(this.connection, transaction, [fromKeypair]);
    }

    // Add more Solana related functionalities as needed
}

export default SolanaClient;
