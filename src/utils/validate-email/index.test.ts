import { describe, expect, it } from 'vitest'
import { validateEmail } from '@/utils/validate-email'

describe('validateEmail', () => {
  it('should return true for valid emails', () => {
    expect(validateEmail('test@example.com')).toBeTruthy()
    expect(validateEmail('user.name@domain.co.id')).toBeTruthy()
  })

  it('should return false for invalid emails', () => {
    expect(validateEmail('invalid-email')).toBeFalsy()
    expect(validateEmail('@domain.com')).toBeFalsy()
    expect(validateEmail('user@')).toBeFalsy()
    expect(validateEmail('user@domain')).toBeFalsy()
  })
})
