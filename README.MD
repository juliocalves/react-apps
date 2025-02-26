# React Apps Monorepo

Este repositório contém múltiplos projetos React, cada um voltado para diferentes finalidades (administração, CMS, delivery, etc.). A seguir, apresentamos uma visão geral da estrutura, instruções de instalação e uso, além de informações adicionais relevantes.

---

## Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Pré-Requisitos](#pré-requisitos)
4. [Instalação](#instalação)
5. [Configurações](#configurações)
6. [Executando os Projetos](#executando-os-projetos)
7. [Scripts](#scripts)
8. [Contribuindo](#contribuindo)
9. [Licença](#licença)
10. [Contato](#contato)

---

## Visão Geral

Este repositório agrupa diversos aplicativos React que podem compartilhar recursos e configurações. Entre eles estão:

- **app-admin**: Painel administrativo para gerenciamento de dados e usuários.
- **app-cms**: Aplicação de CMS (Content Management System) para edição e publicação de conteúdo.
- **app-food-delivery**: Front-end para um sistema de pedidos de comida.
- **app-food-delivery-man**: Interface para entregadores acompanharem seus pedidos.
- **app-reserva**: Aplicação de reservas (por exemplo, de mesas ou serviços).

Os projetos podem utilizar recursos comuns, como configurações do Firebase (armazenadas em `firestoreconfig.js`), scripts de geração de manifestos (`gerarManifest.js`), além de dependências gerenciadas pelo arquivo `package.json`.

---

## Estrutura de Pastas

```plaintext
REACT-APPS/
  ├─ app-admin/
  ├─ app-cms/
  ├─ app-food-delivery/
  ├─ app-food-delivery-man/
  ├─ app-reserva/
  ├─ node_modules/
  ├─ .env
  ├─ .gitignore
  ├─ firestoreconfig.js
  ├─ gerarManifest.js
  ├─ logo.png
  ├─ package.json
  └─ README.md
```

- **app-admin, app-cms, app-food-delivery, app-food-delivery-man, app-reserva**: Diretórios dos aplicativos React, cada um focado em uma funcionalidade específica.
- **node_modules/**: Diretório que armazena as dependências instaladas (gerado automaticamente).
- **.env**: Arquivo de variáveis de ambiente (não versionado por padrão).
- **.gitignore**: Arquivo que define quais arquivos/pastas devem ser ignorados pelo Git.
- **firestoreconfig.js**: Configurações para integração com o Firebase.
- **gerarManifest.js**: Script que auxilia na geração/atualização de manifestos (por exemplo, `manifest.json` para PWAs).
- **logo.png**: Logo do projeto ou utilizada nos aplicativos.
- **package.json**: Lista de dependências e scripts comuns.
- **README.md**: Este documento.

---

## Pré-Requisitos

- **Node.js** (versão recomendada: 14 ou superior)
- **npm** ou **yarn** para gerenciamento de pacotes
- **Conta no Firebase** (opcional, caso utilize o `firestoreconfig.js` para funcionalidades específicas)

---

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/react-apps.git
   cd react-apps
   ```

2. **Instale as dependências**:
   - Para instalar as dependências compartilhadas:
     ```bash
     npm install
     ```
   - Caso cada subpasta possua seu próprio `package.json`, entre na respectiva pasta e instale:
     ```bash
     cd app-admin
     npm install
     # ou
     yarn
     ```

3. **Configuração do `.env`**:
   - Crie ou edite o arquivo `.env` na raiz ou dentro de cada projeto para armazenar variáveis de ambiente (chaves de API, URLs de serviços, etc.).
   - Exemplo de `.env`:
     ```plaintext
     REACT_APP_API_URL=https://api.exemplo.com
     REACT_APP_FIREBASE_KEY=abc123
     ```

---

## Configurações

- **firestoreconfig.js**:  
  - Este arquivo pode conter configurações para integração com o Firebase, como `apiKey`, `authDomain`, `projectId`, etc.  
  - Certifique-se de que as credenciais estejam corretas e mantenha essas informações seguras (não exponha em repositórios públicos).

- **gerarManifest.js**:  
  - Script para gerar ou atualizar o manifesto do PWA (caso cada aplicação seja uma Progressive Web App).  
  - Consulte o código para entender como customizar o manifesto (ícones, nome da aplicação, cores, etc.).

---

## Executando os Projetos

Cada aplicativo pode ter sua própria forma de execução. Geralmente, em React, utilizamos:

```bash
# Acesse a pasta do projeto desejado
cd app-admin

# Execute o servidor de desenvolvimento
npm start
# ou
yarn start
```

Por padrão, o projeto será iniciado em `http://localhost:3000` (ou outra porta configurada).

---

## Scripts

O arquivo `package.json` na raiz (ou nos subdiretórios) pode conter scripts úteis, como:

- **`start`**: Inicia a aplicação em modo de desenvolvimento.
- **`build`**: Gera a versão de produção da aplicação.
- **`test`**: Executa a suíte de testes (caso existam).
- **`eject`**: Remove as abstrações do create-react-app (se aplicável).

Verifique o `package.json` de cada subpasta para mais detalhes.

---

## Contribuindo

1. **Fork** este repositório e crie sua própria branch:  
   ```bash
   git checkout -b minha-feature
   ```
2. Faça as modificações necessárias e crie commits descritivos:
   ```bash
   git commit -m "Implementa nova funcionalidade de login"
   ```
3. **Push** para seu fork:
   ```bash
   git push origin minha-feature
   ```
4. Abra um **Pull Request** neste repositório, descrevendo as mudanças propostas.

---

## Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT). Sinta-se à vontade para usar e modificar o código, desde que mantenha a referência aos autores originais.

---

## Contato

- **Autor**: Júlio César Alves Rodrigues  
- **E-mail**: [juliocalves.ro@gmail.com](mailto:juliocalves.ro@gmail.com)  
- **LinkedIn**: [Seu LinkedIn](https://www.linkedin.com)  
- **GitHub**: [Seu GitHub](https://github.com/SeuUsuario)

Em caso de dúvidas ou sugestões, fique à vontade para abrir uma [Issue](https://github.com/SeuUsuario/react-apps/issues) ou entrar em contato diretamente. Agradecemos o seu interesse no projeto!
