# Typed Link

**Typed Link** is a library to generate type-safe links for your app. It provides **compile-time safety** for both route and query parameters with **minimal runtime costs**.

While [Typed Routes](https://nextjs.org/docs/app/api-reference/next-config-js/typedRoutes) exist, **file-based routing** does not provide **type-safe handling** of route params or search queries. **Catch-all routes** can make typed routes impractical. In advanced Next.js projects with dynamic routing and middleware rewrites, user-facing links and internal file-based routes may differ, making **Typed Link** especially useful since it remains **decoupled from internal routing**.

## Features

- **Type-safe URLs**: Ensures correct use of path, route params and query params at compile-time, preventing incorrect links.
- **Autocomplete**: When using the `link` helper, routes are displayed with autocompletion in your editor.
- **Minimal Runtime Cost**: Does not bundle route definitions in the runtime. Pure utility for URL generation.
- **Framework Agnostic**: Works independently of any routing library, making it reusable across SSR, SSG, and CSR contexts.

## Installation

To install **Typed Link**, you can use **npm** or **yarn**:

```sh
npm install typed-link
```

or

```sh
yarn add typed-link
```

## Usage

### 1. Defining Link Helper

**Define your routes** and use **Link Helper** to create URLs.

src/lib/link.ts:

```typescript
import { createLinkHelper } from 'typed-link'

// Define your routes
type AppRoutes = {
  '/about': {
    params: { locale: string }
  }
  '/products/[productId]': {
    params: { productId: string }
    query?: {
      referrer?: string
    }
  }
  '/dynamic-routes/[...slug]': {
    params: { slug: string[] }
  }
}

// Create and export a link helper with routes
export const link = createLinkHelper<AppRoutes>()
```

### 2. Using Link Helper

Use the defined `link` function throughout your application.

```typescript
import Link from 'next/link'
import { link } from '@/lib/link'

export default function App() {
  return (
    <Link
      href={
        // Generates '/products/123?referrer=social'
        link('/products/[productId]', {
          params: { productId: '123' },
          query: { referrer: 'social' },
        })
      }
    >
      Product 123
    </Link>
  )
}
```

### Decoupling from Routing Logic

**Typed Link** focuses purely on link generation, making it suitable for **server-side code**, **React Server Components**, or **unit tests** without routing context. You can use it in your Next.js Middleware, in a pure function, and more.

```typescript
import { link } from '@/lib/link'

import { User, getCurrentUser } from '@/lib/user'

async function getUserLink(user: User) {
  const currentUser = await getCurrentUser()

  if (user.id === currentUser.id) {
    return link('/profile')
  }

  return link('/users/[username]', {
    params: {
      username: user.username,
    },
  })
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
