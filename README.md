# Jegue Rei - O Jogo 🎮

A fun browser-based game where you control a donkey ("Jegue") collecting presents while avoiding obstacles. Built with Next.js, TypeScript, and Firebase.

## 🎯 Game Features

- Control your character using arrow keys
- Collect presents to increase your score
- Avoid moving obstacles ("pico-picos")
- Score system based on presents collected and survival time
- Online leaderboard with Firebase integration
- Local storage fallback for offline play

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- A Firebase project (for online features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jegue-rei-web.git
cd jegue-rei-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Play

1. Enter your name on the main menu
2. Use arrow keys to control your character:
   - ⬆️ Move up
   - ⬇️ Move down
   - ⬅️ Move left
   - ➡️ Move right
3. Collect presents to increase your score
4. Avoid the moving obstacles
5. Your score is calculated based on:
   - Number of presents collected
   - Time survived
6. Game ends when you hit an obstacle
7. Your high score will be saved to the online leaderboard

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Firebase](https://firebase.google.com/) - Backend and database
- [Radix UI](https://www.radix-ui.com/) - UI components

## 🚀 Deployment

To build for production:

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm run start
# or
yarn start
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ✨ Acknowledgments

- Game assets and design inspiration
- Firebase for providing the backend infrastructure
- Next.js team for the amazing framework
