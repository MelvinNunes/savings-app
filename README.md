# MZN Savings Challenge Dashboard

A Next.js application that visualizes savings and investment tracking data for the MZN Savings Challenge 2025. The dashboard provides interactive visualizations and analysis of different savings categories including base savings, individual/couple tracking, and investment growth, with data persistence using Supabase and full internationalization support.

## Features

- Multiple savings category tracking
- Monthly progress visualization
- Comparative analysis between different saving goals
- Responsive design for all devices
- Interactive data visualization components
- Real-time data synchronization with Supabase
- Secure authentication and data management
- Internationalization support:
  - English (default)
  - Portuguese
  - More languages planned for future releases

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Recharts for data visualization
- TypeScript (optional)
- Shadcn/UI components
- Supabase for:
  - Authentication
  - Database
  - Real-time subscriptions
  - Row Level Security
- next-intl for internationalization

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn package manager
- Supabase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/MelvinNunes/savings-web
```

2. Install dependencies

```bash
cd savings-web
npm install
# or
yarn install (recommended)
```

3. Set up Supabase

- Create a new project in Supabase
- Copy your project URL and anon key
- Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server

```bash
npm run dev
# or
yarn dev (recommended)
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
savings-web/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── charts/
│   ├── ui/
│   └── layout/
├── lang/
│   ├── en.json
│   └── pt.json
├── lib/
│   ├── utils.ts
│   └── supabase.ts
├── middleware.ts
├── public/
```

## Internationalization

The app uses `next-intl` for internationalization support. Language files are stored in the `messages` directory.

### Available Languages

- English (en) - Default
- Portuguese (pt)

### Adding New Translations

1. Create a new JSON file in the `messages` directory for your language (e.g., `es.json` for Spanish)
2. Copy the structure from `en.json` and translate the values
3. Update the middleware configuration to include the new locale

Example translation file structure:

```json
{
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "settings": "Settings"
  },
  "savings": {
    "title": "Savings Dashboard",
    "totalSaved": "Total Saved"
  }
}
```

## Database Schema

```sql
-- Example Supabase schema
CREATE TABLE savings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  month VARCHAR(255),
  amount DECIMAL(10,2),
  category VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE savings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own savings"
  ON savings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own savings"
  ON savings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Data Structure

The application handles four main categories of savings data:

1. Base MZN tracking (800/1250)
2. Individual/Couple savings
3. Saving goals (750/1000)
4. Investment tracking (200/300)

## Environment Variables

Rename `.env.example` to `.env.local` and update the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments

- Based on the MZN Savings Challenge 2025
- Inspired by personal finance tracking needs
- UI components from Shadcn/UI library
- Powered by Supabase backend services
