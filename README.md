# 365 Day

A simple journaling app built with Expo and React Native.

The app shows one question per day, brings the same question back on the same date each year, and lets you compare how your answers change over time.

## Features

- One daily reflection question
- Five-year timeline for the same day
- Local-only data storage
- Daily reminder support
- Archive view for past dates
- Settings for reminder and timeline behavior

## Tech Stack

- Expo
- React Native
- Expo Router
- TypeScript
- AsyncStorage

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the Expo dev server:

```bash
npm start
```

3. Run on a platform:

```bash
npm run ios
npm run android
npm run web
```

## Tests

Run the test suite with:

```bash
npm test
```

## Project Structure

```text
app/          Expo Router screens
src/          Components, context, constants, and app logic
tests/        Domain tests
ios/          Native iOS project
```

## GitHub

This project is connected to:

[https://github.com/samanthatran-95/365-day](https://github.com/samanthatran-95/365-day)

To push changes:

```bash
git add .
git commit -m "Your message"
git push
```

