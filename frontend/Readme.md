# SpinArchive 🎵

A sophisticated vinyl record management system with integrated market analytics, built with modern web technologies.


## ✨ Core Features

### 🛡️ Secure Authentication
- JWT-based user registration/login flow
- Protected client-side routing

### 📦 Collection Management
- Add/remove physical/digital releases
- Track purchase details (price/date/condition)
- Custom tagging system with color-coding
- Advanced filtering (artist/year/genre/format)

### 📊 Data Insights
- Genre distribution visualization (React ChartJS 2)
- Collection value estimation
- Market price trend analysis
- Format comparison metrics

### 🔍 Discogs Integration
- Real-time release/master search
- Marketplace data synchronization
- Artist metadata enrichment

## 🧩 Technology Stack

### Core Framework
- **React 18** (Vite build system)

### UI Components
- **Material-UI v5** (Component library)
- **Emotion** (CSS-in-JS styling)

### Data Management
- **React Query** (Server state management)
- **Axios** (HTTP client)

### Visualization
- **React ChartJS 2** (Interactive charts)
- **Chart.js** (Data visualization engine)

### Routing
- **React Router 6** (Declarative navigation)

## 📂 Project Structure

```
spinarchive/
├── public/                 # Static assets
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── components/         # Reusable components
│   │   ├── charts/         # Visualization components
│   │   ├── forms/          # Form controls
│   │   └── navigation/     # App bars & menus
│   │
│   ├── features/           # Feature modules
│   │   ├── auth/           # Authentication logic
│   │   ├── collection/     # Collection management
│   │   └── market/         # Market data integration
│   │
│   ├── styles/             # Global styling
│   │   ├── theme.ts        # MUI theme configuration
│   │   └── global.css      # Base styles
│   │
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
│
├── .env.example            # Environment template
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js ≥18.x
- Discogs API credentials

### Setup Instructions
```bash
# Clone repository
git clone https://github.com/your-org/spinarchive.git

# Install dependencies
cd spinarchive && npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Launch development server
npm run dev
```

### Environment Variables
```ini
VITE_API_ENDPOINT="http://localhost:5000/api"
VITE_DISCOGS_KEY="your_client_key"
VITE_DISCOGS_SECRET="your_client_secret"
```


## 📜 License

MIT Licensed. See LICENSE for full text.

