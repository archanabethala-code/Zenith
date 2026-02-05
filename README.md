
# Zenith - Appointment Management System

A sleek, professional appointment records platform.

## Local Setup Instructions

1. **Install Dependencies**
   Open your terminal in this directory and run:
   ```bash
   npm install
   ```

2. **Configure API Key**
   Create a file named `.env` in this directory and add your Google Gemini API key:
   ```env
   VITE_API_KEY=your_actual_key_here
   ```
   *(Note: The code currently uses `process.env.API_KEY`. For local Vite development, you should either set an environment variable named `API_KEY` or update `geminiService.ts` to use `import.meta.env.VITE_API_KEY`.)*

3. **Start Development Server**
   Run the following command:
   ```bash
   npm run dev
   ```

4. **View the App**
   Open your browser to the URL displayed in the terminal (usually `http://localhost:5173`).

## Credentials for Testing
- **Receptionist**: `reception@zenith.com` / `access123`
- **Doctor**: `doctor@zenith.com` / `med456`
