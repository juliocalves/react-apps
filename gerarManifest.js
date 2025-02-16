import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";
import 'dotenv/config';
import sharp from "sharp";
import pngToIco from "png-to-ico";
import readline from "readline";

// Função para ler input do terminal
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

const inputLogoPath = 'logo.png'; // Caminho para o logo original

// Tamanhos desejados para os ícones (ajuste conforme necessário)
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 24, name: 'favicon-24x24.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 64, name: 'icon-64x64.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 256, name: 'icon-256x256.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

async function generateIcons(outputDir) {
  try {
    // Gera os ícones nos tamanhos desejados
    for (const { size, name } of sizes) {
      await sharp(inputLogoPath)
        .resize(size, size)
        .toFile(`${outputDir}/${name}`);
      console.log(`Gerado: ${name}`);
    }

    // Gera o favicon.ico a partir da versão 16x16
    const icoBuffer = await pngToIco(`${outputDir}/favicon-16x16.png`);
    fs.writeFileSync(`${outputDir}/favicon.ico`, icoBuffer);
    console.log('Gerado: favicon.ico');
  } catch (error) {
    console.error('Erro ao gerar os ícones:', error);
  }
}

// Configuração do Firebase (utilizando variáveis de ambiente)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Inicializa o app Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Obtém os dados de identidade do Firestore.
 * Supõe que os dados estão no documento "config" da coleção "identity".
 */
export async function getIdentity() {
  try {
    const identityDocRef = doc(db, "identity", "config");
    const docSnap = await getDoc(identityDocRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Erro ao buscar identidade:", error);
    return null;
  }
}

/**
 * Função principal: gera os ícones, cria o manifest e salva tudo na pasta informada.
 */
async function gerarManifest() {
  // Solicita o nome da pasta de saída
  const outputDir = await askQuestion("Informe o nome da pasta de saída: ");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    console.log(`Pasta "${outputDir}" criada.`);
  } else {
    console.log(`Pasta "${outputDir}" já existe.`);
  }

  // Gera os ícones na pasta informada
  await generateIcons(outputDir);

  // Busca os dados de identidade no Firestore
  const identity = await getIdentity();
  if (!identity) {
    console.error("Identidade não encontrada no Firestore.");
    return;
  }

  // Cria o array de ícones utilizando os nomes definidos em sizes
  const icons = [
    {
      src: "favicon.ico",
      sizes: "16x16",
      type: "image/x-icon",
    },
    ...sizes.map(({ size, name }) => ({
      src: name,
      sizes: `${size}x${size}`,
      type: "image/png",
    })),
  ];
  const screenshots = [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1280x800",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "600x800",
      "type": "image/png"
    }
  ];

  // Cria o objeto manifest utilizando os dados do Firestore ou valores padrão
  const manifest = {
    short_name: identity.short_name || "Jtech App",
    name: identity.name || "Jtech App - Solução Sistemas Web",
    description:
      identity.description ||
      "Sistemas web responsivos e dinâmicos como aplicativos. Solução Sistemas Web",
    icons: icons,
    screenshots:screenshots,
    start_url: identity.start_url || ".",
    display: identity.display || "standalone",
    theme_color: identity.theme_color || "#000000",
    background_color: identity.background_color || "#ffffff",
  };

  // Converte o objeto manifest para uma string JSON formatada
  const manifestJson = JSON.stringify(manifest, null, 2);

  // Salva o manifest em um arquivo JSON na pasta de saída
  fs.writeFileSync(`${outputDir}/manifest.json`, manifestJson, "utf8");
  console.log(`Arquivo "manifest.json" gerado com sucesso na pasta "${outputDir}"!`);
}

// Executa a função principal
gerarManifest();
