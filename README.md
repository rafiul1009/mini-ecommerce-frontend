# Mini E-commerce Frontend

A modern e-commerce frontend application built with Next.js 15, React 19, and TypeScript. This project implements a complete shopping experience with authentication, product browsing, cart management, and checkout functionality.

## Tech Stack

### Core
- **Next.js 15.3.1** - React framework with server-side rendering
- **React 19.0.0** - UI library
- **TypeScript** - Type safety and better developer experience

### State Management & Forms
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variants management

### Development Tools
- **ESLint** - Code linting
- **Jest** - Testing framework

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth-pages)/       # Authentication related pages
│   ├── (nav-layout-pages)/ # Pages with navigation layout
│   └── layout.tsx          # Root layout with Geist font
├── components/             # Reusable UI components
├── services/               # API and app services
├── store/                  # Redux store configuration
├── types/                  # TypeScript type definitions
└── views/                  # Page-specific components
```

## Features

- 🔐 Authentication (Login/Register)
- 🛍️ Product browsing
- 🛒 Shopping cart management
- 💳 Checkout process
- 📱 Responsive design
- 🎨 Modern UI with Geist font
- 🔔 Toast notifications

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd mini-ecommerce-frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Development Guidelines

- Use TypeScript for all new files
- Follow the existing component structure
- Implement responsive designs using Tailwind CSS
- Use React Hook Form for form handling
- Manage global state with Redux Toolkit
- Follow the established routing pattern in the app directory

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.