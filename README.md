# 💥 Splat - Jogo Mobile

![Versão do Jogo](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Licença](https://img.shields.io/badge/license-MIT-green.svg)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

Um jogo mobile de reflexos rápidos onde seu objetivo é tocar nas frutas que caem para marcar pontos, enquanto desvia de bombas perigosas. Perfeito para testar sua agilidade e competir pelo topo do placar!

---

### 🎮 Sobre o Jogo

Em **Splat**, os jogadores são desafiados a tocar em frutas que caem na tela para acumular a maior pontuação possível. A cada fruta tocada, pontos são somados e o nível de dificuldade aumenta. Mas cuidado! Tocar em uma bomba ou deixar uma fruta cair resulta na perda de vidas. O jogo termina quando todas as vidas acabam.

<!-- <br>

<img src="./assets/splatdemo.gif" alt="Gameplay do Splat" width="300"/> -->

---

### ✨ Funcionalidades Principais

* **Jogabilidade Rápida e Viciante:** Teste seus reflexos em um desafio que fica cada vez mais rápido.
* **Sistema de Pontuação e Níveis:** A dificuldade aumenta dinamicamente conforme você joga melhor.
* **Placar de Líderes Local:** Compita contra si mesmo e veja os seus melhores recordes.
* **Perfil de Jogador:** Salve seu nome para aparecer no placar.
* **Armazenamento Offline:** Todos os seus recordes e seu nome são salvos diretamente no seu dispositivo, sem necessidade de internet.
* **Reset de Dados:** Opção para limpar todo o progresso e começar do zero.

---

### 🛠️ Tecnologias Utilizadas

* **React Native:** Estrutura principal para o desenvolvimento multiplataforma.
* **Expo (Bare Workflow):** Plataforma e conjunto de ferramentas para facilitar o desenvolvimento e a compilação.
* **TypeScript:** Para um código mais robusto e seguro.
* **React Navigation:** Para a navegação entre as telas do aplicativo.
* **AsyncStorage:** Para o armazenamento de dados localmente no dispositivo.
* **Lucide React Native:** Para os ícones modernos e leves usados na interface.

---

### 🚀 Começando

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento local.

#### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [Yarn](https://yarnpkg.com/) ou [NPM](https://www.npmjs.com/)
* Um emulador Android/iOS ou um dispositivo físico.
* Para a compilação local: Ambiente de desenvolvimento Android configurado (Android Studio, SDK, etc.).

#### Instalação

1.  Clone o repositório para a sua máquina:
   ```bash
   git clone https://github.com/function404/splatgame_.git
   ```

2.  Navegue até o diretório do projeto:
   ```bash
   cd splatgame_
   ```

3.  Instale todas as dependências do projeto:
   ```bash
   npm install
   ```
   _ou, se você usa Yarn:_
   ```bash
   yarn install
   ```

#### Executando o Aplicativo

1.  Inicie o servidor de desenvolvimento do Metro:
   ```bash
   npx expo start
   ```

2.  Use as opções que aparecerão no terminal para rodar o aplicativo:
   * Pressione `a` para abrir em um emulador Android.
   * Pressione `i` para abrir em um simulador iOS.
   * Escaneie o QR Code com o aplicativo Expo Go no seu dispositivo físico.

---

### 📦 Gerando um APK (Build)

Uma das maneiras de gerar um arquivo de instalação `.apk` para Android:

1.  **Build Local:** Compila o aplicativo diretamente no seu computador. Requer o [ambiente de desenvolvimento Android](https://medium.com/geekculture/react-native-generate-apk-debug-and-release-apk-4e9981a2ea51) totalmente configurado.
   ```bash
   # Execute o comando prebuild com a flag --clean
   npx expo prebuild --clean

   # Navegue até a pasta android
   cd android

   # Execute o comando de compilação do Gradle
   ./gradlew assembleRelease
   ```
   O `.apk` final estará em `android/app/build/outputs/apk/release/`.

---

### 🤝 Contribuição

Contribuições são o que tornam a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito bem-vinda**.

1.  Faça um "Fork" do projeto
2.  Crie sua "Feature Branch" (`git checkout -b feature/AmazingFeature`)
3.  Faça o "Commit" de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4.  Faça o "Push" para a Branch (`git push origin feature/AmazingFeature`)
5.  Abra um "Pull Request"

---

### 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE.txt` para mais informações.
