# 💥 Splat - Jogo Mobile

![Versão do Jogo](https://img.shields.io/badge/version-1.8.22-blue.svg)
![Licença](https://img.shields.io/badge/license-MIT-green.svg)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

Um jogo mobile de reflexos rápidos onde seu objetivo é tocar nos objetos que caem para marcar pontos, desviar de perigos e progredir através de fases temáticas. Teste sua agilidade e compita pelo topo do placar global!

---

### 🎮 Sobre o Jogo

Em **Splat Game**, os jogadores são desafiados a tocar em objetos que caem na tela para acumular a maior pontuação possível em diversas fases, cada uma com sua própria temática, como Gastronomia, Administração, Enfermagem e Análise e Desenvolvimento de Sistemas. A cada objeto tocado, pontos são somados e o nível de dificuldade aumenta. Mas cuidado! Tocar em um objeto perigoso ou deixar um objeto bom cair resulta na perda de vidas. O jogo termina quando todas as vidas acabam.

<!-- <br>

<img src="./assets/splatdemo.gif" alt="Gameplay do Splat" width="300"/> -->

---

### ✨ Funcionalidades Principais

* **Jogabilidade Rápida e Viciante:** Teste seus reflexos em um desafio que fica cada vez mais rápido.
* **Sistema de Pontuação e Múltiplas Fases:**  A dificuldade aumenta dinamicamente e novas fases temáticas são desbloqueadas conforme você atinge as pontuações necessárias.
* **Placar de Líderes Local:**  Compita com jogadores de todo o mundo e veja sua posição no ranking.
* **Autenticação e Perfil de Jogador:** Crie sua conta para salvar seu progresso e competir no placar.
* **Progresso Salvo na Nuvem::** Seus recordes e fases desbloqueadas são salvos online com o Firebase.
* **Interface com Ícones Modernos:** Utiliza a biblioteca Lucide para ícones leves e modernos.

---

### 🛠️ Tecnologias Utilizadas

* **React Native:** Estrutura principal para o desenvolvimento multiplataforma.
* **Expo (Bare Workflow):** Plataforma e conjunto de ferramentas para facilitar o desenvolvimento e a compilação.
* **TypeScript:** Para um código mais robusto e seguro.
* **Firebase:** Para autenticação de usuários e banco de dados em tempo real (Firestore) para salvar o progresso e o placar de líderes.
* **AReact Navigation:** Para a navegação entre as telas do aplicativo.
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
