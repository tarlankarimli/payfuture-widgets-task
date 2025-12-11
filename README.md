# Setup

 Install dependencies:
npm install

Run development server:
npm run dev

Build for production:
npm run build

## Environment

Weather widget needs an OpenWeather API key. Create `.env.local` or `.env` in the project root:
VITE_WEATHER_API_KEY=your_openweather_key

- Restart the dev server after adding/changing the key.
- Default city is Baku. To change it edit `CITY` in `src/components/widgets/WeatherWidget.tsx` or make it env-driven if you prefer.

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit
- React Router
- Tailwind CSS
- Vite
- @dnd-kit (drag and drop)
- Axios
- Vitest (testing)