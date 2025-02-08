
import { Client, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Sua API Endpoint
  .setProject('679fc1150016dba6562b'); // Seu Project ID

const storage = new Storage(client);

export { storage };