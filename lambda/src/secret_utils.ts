import { SecretsManager } from "aws-sdk";

export async function getApiKey(secretId: string): Promise<string> {
    try {
        const secretsManager = new SecretsManager();
        const data = await secretsManager.getSecretValue({ SecretId: secretId }).promise();
        return data.SecretString ?? '';
    } catch (error) {
        console.error(`Error retrieving secret: ${error}`);
        throw error;
    }
}