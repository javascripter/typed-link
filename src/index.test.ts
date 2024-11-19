import { describe, it, expect } from 'vitest'
import { createLinkHelper } from './index'

type AppRoutes = {
  '/about': {}
  '/products/[productId]': {
    params: { productId: string }
    query?: { referrer: string }
  }
  '/dynamic-routes/[...slug]': {
    params: { slug: string[] }
  }
}

const link = createLinkHelper<AppRoutes>()

describe('link helper', () => {
  it('should generate a link for the about page', () => {
    const result = link('/about', {})
    expect(result).toBe('/about')
  })

  it('should generate a link with query parameters', () => {
    const result = link('/products/[productId]', {
      params: { productId: '123' },
      query: { referrer: 'social' },
    })
    expect(result).toBe('/products/123?referrer=social')
  })

  it('should generate a link for dynamic routes', () => {
    const result = link('/dynamic-routes/[...slug]', {
      params: { slug: ['category', 'item'] },
    })
    expect(result).toBe('/dynamic-routes/category/item')
  })
})
