# Notes App

React notes application with themes and glassmorphism UI.

## Technical Features

- **7 Themed UI**: Cottage Core, Sakura Blossom, Ocean Breeze, Sunset Glow, Forest Green, Dark Academia, Midnight
- **Glassmorphism Effects**: Backdrop blur with transparency on all note cards
- **Note Types**: Text, checklist, drawing canvas, voice recording
- **File Attachments**: Image upload and display
- **Drag & Drop**: Reorder notes with @hello-pangea/dnd
- **Search & Filter**: Content search, label filtering, archive system
- **Local Storage**: Persistent data with JSON export/import
- **PWA Ready**: Service worker registration

## Tech Stack

- React 19 + Vite
- Tailwind CSS (backdrop-blur, glassmorphism)
- Lucide React icons
- date-fns for timestamps
- Canvas API for drawing

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```