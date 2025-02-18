# MK Price Checker

A mobile web application that allows users to scan QR codes and check product prices and inventory from a PostgreSQL database.

## Features

- QR Code scanning using device camera
- Real-time price and inventory checking
- Mobile-friendly interface
- Error handling and user feedback

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- A device with a camera (for QR code scanning)

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd mkpricecheck
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your mobile browser to start using the application.

## Usage

1. Allow camera access when prompted
2. Point your camera at a QR code
3. The application will automatically scan and display the product information:
   - Product name
   - Price
   - Available quantity

## Technologies Used

- Next.js 13+
- TypeScript
- Tailwind CSS
- html5-qrcode
- PostgreSQL
- Node-postgres (pg) 