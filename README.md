# Quotely

Quotely is a mobile note-taking application designed for ease of use and a beautiful interface. It allows users to create, manage, and organize their thoughts with customizable notes and a secure authentication system.

## Features

- **Google Authentication:** Securely sign in and manage your account using your Google ID.
- **Create & Manage Notes:** Easily create new notes with custom content and choose from a variety of background colors to personalize them.
- **View & Search Notes:** Browse through all your notes, with infinite scrolling, and quickly find specific notes using the search functionality.
- **Bulk Actions:** Select multiple notes to delete them efficiently.
- **Intuitive User Interface:** A clean and modern design ensures a pleasant note-taking experience.
- **Onboarding Experience:** Guides new users through the application's core features.

## Stacks / Technologies

| Category     | Technology                   | Link                                                                                                                                           |
| :----------- | :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | React Native                 | [https://reactnative.dev/](https://reactnative.dev/)                                                                                           |
|              | Expo                         | [https://expo.dev/](https://expo.dev/)                                                                                                         |
|              | React Navigation             | [https://reactnavigation.org/](https://reactnavigation.org/)                                                                                   |
|              | React Query                  | [https://tanstack.com/query/latest](https://tanstack.com/query/latest)                                                                         |
|              | Axios                        | [https://axios-http.com/](https://axios-http.com/)                                                                                             |
|              | `@expo-google-fonts/geist`   | [https://github.com/expo/google-fonts/tree/master/packages/geist](https://github.com/expo/google-fonts/tree/master/packages/geist)             |
|              | `react-native-toast-message` | [https://github.com/calintamas/react-native-toast-message](https://github.com/calintamas/react-native-toast-message)                           |
|              | `AsyncStorage`               | [https://react-native-async-storage.github.io/async-storage/docs/usage](https://react-native-async-storage.github.io/async-storage/docs/usage) |
| **Backend**  | Express.js                   | [https://expressjs.com/](https://expressjs.com/)                                                                                               |
|              | TypeScript                   | [https://www.typescriptlang.org/](https://www.typescriptlang.org/)                                                                             |
|              | Drizzle ORM                  | [https://orm.drizzle.team/](https://orm.drizzle.team/)                                                                                         |
|              | Neon Database                | [https://neon.tech/](https://neon.tech/)                                                                                                       |
|              | Google OAuth2                | [https://developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)                             |
|              | JWT (`jsonwebtoken`)         | [https://jwt.io/](https://jwt.io/)                                                                                                             |
|              | Zod                          | [https://zod.dev/](https://zod.dev/)                                                                                                           |
|              | Dotenv                       | [https://www.npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv)                                                                   |

## Installation

To set up Quotely locally, follow these steps:

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/TreasureUzoma/quotely
    cd quotely
    ```
2.  **Navigate to the `server` directory:**
    ```bash
    cd server
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
4.  **Environment Variables:** Create a `.env` file in the `server` directory and add the following:
    ```
    JWT_SECRET="YOUR_JWT_SECRET_KEY"
    REFRESH_SECRET="YOUR_REFRESH_TOKEN_SECRET_KEY"
    GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
    GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
    DATABASE_URL="YOUR_NEON_DATABASE_URL" # e.g., postgres://user:password@host:port/database
    PROD_URL="YOUR_SERVER_BASE_URL" # e.g., http://localhost:3000 or your deployed URL
    ```
    - Generate strong secrets for `JWT_SECRET` and `REFRESH_SECRET`.
    - Obtain `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from the Google Cloud Console for OAuth 2.0.
    - Set up a PostgreSQL database (e.g., using Neon.tech for a serverless option) and provide the `DATABASE_URL`.
    - `PROD_URL` should be the base URL where your backend server is accessible.
5.  **Run Drizzle Migrations:**
    ```bash
    npx drizzle-kit push:pg
    ```
6.  **Start the backend server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The server should now be running on `http://localhost:3000` (or the port specified in `server/src/index.ts`).

### Frontend Setup

1.  **Navigate to the `quotely` (client) directory:**
    ```bash
    cd ../quotely # If you are in the 'server' directory
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure API URL:**
    The `apiUrl` in `quotely/constants.ts` is set to `https://quotelyapi.vercel.app/api/v1`. If you are running the backend locally, update this to your local backend URL (e.g., `http://192.168.1.X:3000/api/v1` or `http://localhost:3000/api/v1` for emulator/device).
4.  **Start the Expo development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
5.  **Run on a device/emulator:**
    - **Android:** Press `a` in the terminal or scan the QR code with the Expo Go app.
    - **iOS:** Press `i` in the terminal or scan the QR code with the Expo Go app.

## Usage

1.  **Onboarding:** Upon first launch, you will be guided through an onboarding process.
2.  **Sign In:** After onboarding, you will be directed to the authentication screen. Tap "Continue with Google" to sign in or create an account.
3.  **Notes Home Screen:** Once signed in, you'll see your notes (or a message to create your first note).
    - Scroll down to load more notes.
    - Use the search bar at the top to filter notes by content.
    - Long-press a note to enter selection mode.
4.  **Create New Note:** Navigate to the "New" tab to create a new note.
    - Type your note content (max 160 characters).
    - Tap "Create Note" to save. A random background color will be assigned.
5.  **Delete Notes:** In the home screen, long-press a note to select it. You can select multiple notes. Once selected, a trash icon will appear in the header; tap it to delete the selected notes.

## Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding style and includes appropriate tests if applicable.

[![Readme was generated by Readmit](https://img.shields.io/badge/Readme%20was%20generated%20by-Readmit-brightred)](https://readmit.vercel.app)
