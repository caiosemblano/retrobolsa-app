# Simulador Histórico de Investimentos (Cartola Financeiro)

Este é o repositório de código para o **Simulador Histórico de Investimentos (Cartola Financeiro)**, portado a partir do design do Figma.

O projeto original do design está disponível em: [Design no Figma](https://www.figma.com/design/uyNgINVvSvv279nqV4e5pz/Simulador-Hist%C3%B3rico-de-Investimentos).

O repositório contém duas aplicações:
1. **Frontend Web**: Uma aplicação React Web construída com Vite e Tailwind CSS.
2. **Frontend Mobile**: Um aplicativo móvel desenvolvido em React Native com Expo e TypeScript (disponível na pasta `mobile/`).

---

## 💻 Como Executar a Versão Web (React + Vite)

A versão web está localizada na raiz do repositório.

1. Instale as dependências do projeto web:
   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz do frontend (pasta `retrobolsa-app`) e adicione a URL da API (caso não tenha):
   ```env
   VITE_API_URL=http://localhost:8081
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra o endereço exibido no terminal (geralmente `http://localhost:5173`) no seu navegador.

---


## 📱 Como Executar a Versão Mobile (React Native + Expo)

A versão mobile está localizada na pasta `/mobile`.

1. Acesse o diretório da aplicação mobile:
   ```bash
   cd mobile
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor do Expo:
   ```bash
   npm run start
   ```

4. Para testar o aplicativo:
   - **No celular (Expo Go):** Escaneie o QR Code exibido no terminal com a câmera do seu dispositivo (iOS) ou com o aplicativo Expo Go (Android).
   - **No navegador (Suporte Web):** Pressione a tecla `w` no terminal para compilar e abrir a versão web do aplicativo no seu navegador.