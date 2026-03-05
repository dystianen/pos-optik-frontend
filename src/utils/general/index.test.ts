import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { embedImage } from '.'

describe('util', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('embedImage', () => {
    it('should prefix path with NEXT_PUBLIC_API_BASE_URL', () => {
      process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000'
      expect(embedImage('test.jpg')).toBe('http://localhost:3000/test.jpg')
    })
  })
})
