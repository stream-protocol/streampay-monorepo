import axios from "axios";
import { PaymentService } from "medusa-interfaces";
import { MedusaError, Logger } from "medusa-core-utils";
import { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, Keypair } from "@solana/web3.js";

class StreamPayProviderService extends PaymentService {
    static identifier = "streampay";
    private solanaConnection: Connection;
    private merchantPublicKey: PublicKey;

    constructor({ regionService, customerService, cartService, totalsService }, options) {
        super();
        this.solanaConnection = new Connection(options.solanaClusterUrl || "https://api.mainnet-beta.solana.com");
        this.merchantPublicKey = new PublicKey(options.merchantPublicKey);
    }

    async handleSolanaPayment(payeePublicKey: string, amount: number): Promise<string> {
        try {
            const payeePublicKeyObj = new PublicKey(payeePublicKey);
            const merchantKeypair = await this.retrieveMerchantKeypair(); 

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: payeePublicKeyObj,
                    toPubkey: this.merchantPublicKey,
                    lamports: amount * LAMPORTS_PER_SOL
                })
            );

            const signature = await sendAndConfirmTransaction(this.solanaConnection, transaction, [merchantKeypair]);
            return signature;
        } catch (error) {
            Logger.error(`Error in handleSolanaPayment: ${error}`);
            throw new MedusaError(MedusaError.Types.UNEXPECTED_ERROR, "Failed to process Solana payment.");
        }
    }

    private async retrieveMerchantKeypair(): Promise<Keypair> {
        try {
            const encryptedPrivateKey = await this.getKeyFromKMS("merchant_private_key");
            const decryptedPrivateKey = this.decryptKey(encryptedPrivateKey);
            const privateKeyUint8Array = new Uint8Array(Object.values(JSON.parse(decryptedPrivateKey)));
            return Keypair.fromSecretKey(privateKeyUint8Array);
        } catch (error) {
            Logger.error(`Error retrieving merchant's Keypair: ${error}`);
            throw new MedusaError(MedusaError.Types.UNEXPECTED_ERROR, "Failed to retrieve merchant's Keypair.");
        }
    }

    private async getKeyFromKMS(keyId: string): Promise<string> {
        try {
            // This is a placeholder for the KMS API call
            // Example: const response = await axios.get(`https://your-kms-service.com/api/keys/${keyId}`);
            // Replace the URL and authentication method as per your KMS requirements
            const response = await axios.get(`https://your-kms-service.com/api/keys/${keyId}`, {
                headers: {
                    // Authentication headers or other necessary headers
                }
            });
            return response.data.encryptedKey; // Assuming the API returns the encrypted key in this field
        } catch (error) {
            Logger.error(`Error retrieving key from KMS: ${error}`);
            throw new MedusaError(MedusaError.Types.UNEXPECTED_ERROR, "Failed to retrieve key from KMS.");
        }
    }
    
    private decryptKey(encryptedKey: string): string {
        try {
            // Placeholder for decryption logic
            // The actual implementation will depend on how your KMS handles decryption
            // Example: const decryptedKey = someDecryptionFunction(encryptedKey);
            // This might involve another API call to the KMS or using a local decryption method
            const decryptedKey = someDecryptionFunction(encryptedKey);
            return decryptedKey;
        } catch (error) {
            Logger.error(`Error decrypting key: ${error}`);
            throw new MedusaError(MedusaError.Types.UNEXPECTED_ERROR, "Failed to decrypt key.");
        }
    }    

    // ... other methods ...
}

export default StreamPayProviderService;
