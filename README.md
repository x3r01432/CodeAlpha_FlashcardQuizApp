# CodeAlpha Flashcard Quiz App

A simple flashcard app for studying, built with React Native and Expo for the CodeAlpha App Development internship (Task 1).

## Features

- **Show Answer:** each card shows a question on the front, and tapping **Show Answer** reveals the answer.
- **Navigation:** **Previous** and **Next** buttons move between cards. They switch off at the first and last card.
- **Manage cards:** add, edit, and delete flashcards from the Manage Cards screen.
- **Saved on your device:** cards are stored with AsyncStorage, so they're still there after you close the app.
- **Clean interface:** one focused card view plus a simple list for editing.

The app starts with three sample cards so you can try it right away.

## Tech stack

- React Native with Expo
- `@react-native-async-storage/async-storage` for local storage
- Runs on Android, iOS (through Expo Go), and the web

## Getting started

```bash
git clone https://github.com/x3r01432/CodeAlpha_FlashcardQuizApp.git
cd CodeAlpha_FlashcardQuizApp
npm install
npx expo start
```

Then scan the QR code with the **Expo Go** app on your phone, or press `w` to open it in the browser.

## Project structure

- `App.js`: the whole app (card view, navigation, add, edit, and delete, plus storage)
- `app.json`: Expo configuration
- `assets/`: app icons and splash images

## Known limitation

The delete confirmation pop-up uses the phone's native alert, so on the web version deleting may not ask for confirmation.

## Author

Built by [x3r01432](https://github.com/x3r01432) during the CodeAlpha App Development internship.
