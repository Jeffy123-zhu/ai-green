# GreenPulse AI Frontend

Carbon Footprint-Driven Intelligent Financial Ecosystem - React Frontend

## Features

- 📊 Real-time Dashboard with carbon metrics
- 🌿 Carbon Credit Assessment
- 📈 Green Portfolio Optimization
- 💰 Micro-Loan Application (Alternative Credit)
- 🔍 Anti-Greenwashing Detection

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Build for Production

```bash
npm run build
```

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd src/frontend
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set root directory to `src/frontend`
5. Deploy!

### Option 3: Direct Upload

1. Run `npm run build` locally
2. Go to [vercel.com](https://vercel.com)
3. Drag and drop the `build` folder

## Environment Variables

Create `.env` file for local development:

```env
# Connect to backend API (optional)
REACT_APP_API_URL=http://localhost:8000
```

For Vercel deployment, add environment variables in project settings.

**Note:** If `REACT_APP_API_URL` is not set, the app uses mock data for demo purposes.

## Tech Stack

- React 18
- Recharts (Data Visualization)
- Axios (HTTP Client)

## SDG Alignment

- SDG 7: Affordable and Clean Energy
- SDG 8: Decent Work and Economic Growth
- SDG 13: Climate Action
- SDG 17: Partnerships for the Goals
