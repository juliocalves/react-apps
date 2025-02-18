
import { Client, Storage } from 'appwrite';

/**
 * Initializes the Appwrite client with the specified endpoint and project ID.
 * 
 * @constant {Client} client - The Appwrite client instance.
 * @property {function} setEndpoint - Sets the API endpoint for the client.
 * @property {function} setProject - Sets the project ID for the client.
 */
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Sua API Endpoint
  .setProject('679fc1150016dba6562b'); // Seu Project ID

const storage = new Storage(client);

export { storage };