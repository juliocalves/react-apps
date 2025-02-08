import { Client, Storage } from 'appwrite';

const REACT_APP_APP_WRITE_BUCKET_ID='679fc176000a3676b8a1'
const REACT_APP_APP_WRITE_PROJECT_ID='679fc1150016dba6562b'
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Sua API Endpoint
  .setProject(REACT_APP_APP_WRITE_PROJECT_ID); // Seu Project ID

const storage = new Storage(client);

export { storage };

export const uploadImg = async (file) => {
  if (!file) return null;
  const fileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');

  try {

    const response = await storage.createFile(
      REACT_APP_APP_WRITE_BUCKET_ID,
      fileName,
      file
    );

    return `https://cloud.appwrite.io/v1/storage/buckets/${REACT_APP_APP_WRITE_BUCKET_ID}/files/${response.$id}/view?project=${REACT_APP_APP_WRITE_PROJECT_ID}`;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
};
const extractFileIdFromUrl = (imageUrl) => {
    const parts = imageUrl.split("/files/");
    if (parts.length > 1) {
      return parts[1].split("/")[0];
    }
    return null;
  };

export const deleteFile = async (fileUrl) => {
  const imageId = extractFileIdFromUrl(fileUrl);
  if (!imageId) throw new Error("ID da imagem não encontrado.");
  return storage.deleteFile(REACT_APP_APP_WRITE_BUCKET_ID, imageId);
};