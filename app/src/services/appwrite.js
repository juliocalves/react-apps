import { Client, Storage } from 'appwrite';
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
import imageCompression from "browser-image-compression";
const REACT_APP_APP_WRITE_BUCKET_ID='679fc176000a3676b8a1'
const REACT_APP_APP_WRITE_PROJECT_ID='679fc1150016dba6562b'
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Sua API Endpoint
  .setProject(REACT_APP_APP_WRITE_PROJECT_ID); // Seu Project ID

const storage = new Storage(client);

export { storage };

export const uploadImg = async (file) => {
  // Verifica se o arquivo foi passado
  if (!file) return null;

  // Gera um identificador único para o nome do arquivo.
  // Atenção: utilizar apenas 12 caracteres pode aumentar as chances de colisão.
  //const fileName = uuidv4().substring(0, 12);
  
  // Se for necessário manter o nome original (por exemplo, para extensão), considere concatená-lo.
  // Exemplo:
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4().substring(0, 12)}.${fileExtension}`;

  // OBSERVAÇÃO: Adicionar uma propriedade personalizada (file.fileName) ao objeto File pode não ser útil
  // ou pode ser ignorado pela API. Se o storage.createFile já recebe o nome como parâmetro, não é necessário.
  file.fileName = fileName;
  console.log("Nome gerado para o arquivo:", fileName);

  // Se a imagem for maior que 5MB, comprime antes do upload
  if (file.size > 5 * 1024 * 1024) {
    console.log("Comprimindo imagem...");
    const options = {
      maxSizeMB: 5, // Tamanho máximo permitido após compressão
      maxWidthOrHeight: 1920, // Reduz resolução se necessário
      useWebWorker: true, // Usa processamento paralelo
    };

    try {
      file = await imageCompression(file, options);
    } catch (error) {
      console.error("Erro na compressão:", error);
      return; // Ou considere lançar o erro para o chamador tratar
    }
  }

  try {
    console.log("Criando arquivo com o objeto:", file);
    const response = await storage.createFile(
      REACT_APP_APP_WRITE_BUCKET_ID,
      fileName,
      file
    );

    console.log("Upload realizado com sucesso:", response);

    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${REACT_APP_APP_WRITE_BUCKET_ID}/files/${response.$id}/view?project=${REACT_APP_APP_WRITE_PROJECT_ID}`;
    console.log("URL do arquivo:", fileUrl);

    return fileUrl;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);

    // Exibe detalhes extras do erro, se disponíveis
    if (error.message) {
      console.error("Mensagem de erro:", error.message);
    }
    if (error.code) {
      console.error("Código de erro:", error.code);
    }
    if (error.response) {
      console.error("Resposta do servidor:", error.response);
    }
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }

    // Relança o erro para que o chamador possa tratá-lo
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
