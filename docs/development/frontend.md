# Frontend Development Guide

This guide covers frontend development for the Airline In-Flight Ordering System using Next.js 14 and React 18.

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx      # Main layout component
│   │   ├── Menu.tsx        # Menu display component
│   │   └── ...
│   ├── pages/              # Next.js pages
│   │   ├── index.tsx       # Home page
│   │   ├── menu.tsx        # Menu page
│   │   └── ...
│   ├── services/           # API service layer
│   │   ├── api.ts          # API client
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   │   ├── index.ts        # Main type definitions
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── next.config.js          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Recommended: Node.js 22.x)
- npm 8+

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```

The application will be available at http://localhost:3000

## 🛠️ Technology Stack

### Core Framework
- **Next.js 14**: React framework with SSR and routing
- **React 18**: UI library with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript development

### State Management
- **React Query**: Server state management and caching
- **Zustand**: Client state management
- **React Hook Form**: Form handling and validation

### Styling & UI
- **Styled Components**: CSS-in-JS styling
- **Framer Motion**: Animation library
- **React Icons**: Icon library
- **React Hot Toast**: Notification system

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Lint-staged**: Pre-commit linting

## 📝 Development Guidelines

### Component Structure
```typescript
// Example component structure
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ComponentProps {
  title: string;
  children: React.ReactNode;
}

const StyledComponent = styled.div`
  // Styled component styles
`;

export const Component: React.FC<ComponentProps> = ({ title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <StyledComponent>
        <h1>{title}</h1>
        {children}
      </StyledComponent>
    </motion.div>
  );
};
```

### API Integration
```typescript
// Example API service usage
import { useQuery, useMutation } from 'react-query';
import { apiService } from '../services/api';

// Fetching data
const useMenuItems = (flightNumber: string, cabinClass: string) => {
  return useQuery(
    ['menu', flightNumber, cabinClass],
    () => apiService.getMenu(flightNumber, cabinClass),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

// Mutating data
const useCreateOrder = () => {
  return useMutation(
    (orderData: CreateOrderData) => apiService.createOrder(orderData),
    {
      onSuccess: (data) => {
        toast.success('Order created successfully!');
      },
      onError: (error) => {
        toast.error('Failed to create order');
      },
    }
  );
};
```

### Form Handling
```typescript
// Example form with React Hook Form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  flightNumber: yup.string().required('Flight number is required'),
  date: yup.date().required('Date is required'),
  cabinClass: yup.string().required('Cabin class is required'),
});

const FlightSearchForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FlightSearchData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('flightNumber')} />
      {errors.flightNumber && <span>{errors.flightNumber.message}</span>}
      
      <input type="date" {...register('date')} />
      {errors.date && <span>{errors.date.message}</span>}
      
      <select {...register('cabinClass')}>
        <option value="economy">Economy</option>
        <option value="business">Business</option>
      </select>
      
      <button type="submit">Search</button>
    </form>
  );
};
```

## 🎨 Styling Guidelines

### Styled Components
```typescript
// Global styles
export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
  }
`;

// Component styles
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  
  ${({ variant = 'primary' }) =>
    variant === 'primary'
      ? css`
          background-color: #007bff;
          color: white;
          
          &:hover {
            background-color: #0056b3;
          }
        `
      : css`
          background-color: transparent;
          color: #007bff;
          border: 1px solid #007bff;
          
          &:hover {
            background-color: #f8f9fa;
          }
        `}
`;
```

### Responsive Design
```typescript
// Responsive breakpoints
export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

export const media = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`,
};

// Responsive component
export const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${media.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
`;
```

## 🔧 Configuration

### Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['localhost', 'api.airline-ordering.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## 🧪 Testing

### Unit Testing
```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { MenuItem } from '../components/MenuItem';

describe('MenuItem', () => {
  it('renders menu item correctly', () => {
    const mockItem = {
      id: '1',
      name: 'Grilled Chicken',
      price: 15.99,
      description: 'Tender grilled chicken',
    };

    render(<MenuItem item={mockItem} />);
    
    expect(screen.getByText('Grilled Chicken')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
  });
});
```

### Integration Testing
```typescript
// Example API integration test
import { renderHook } from '@testing-library/react-hooks';
import { useMenuItems } from '../hooks/useMenuItems';

describe('useMenuItems', () => {
  it('fetches menu items successfully', async () => {
    const { result, waitFor } = renderHook(() =>
      useMenuItems('AA123', 'economy')
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toBeDefined();
    expect(result.current.data.menu).toHaveLength(3);
  });
});
```

## 📦 Build & Deployment

### Development Build
```bash
npm run build
npm start
```

### Production Optimization
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Bundle analysis with `@next/bundle-analyzer`
- Performance monitoring

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Airline In-Flight Ordering
```

## 🔍 Debugging

### React Developer Tools
- Install React Developer Tools browser extension
- Use Profiler for performance analysis
- Debug component state and props

### Next.js Debugging
```bash
# Enable Next.js debugging
DEBUG=* npm run dev
```

### Error Boundaries
```typescript
// Example error boundary
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

// Usage
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <YourComponent />
</ErrorBoundary>
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Styled Components Documentation](https://styled-components.com/docs)
- [React Query Documentation](https://tanstack.com/query)

---

*For more information about the overall architecture, see [System Overview](../architecture/overview.md).* 