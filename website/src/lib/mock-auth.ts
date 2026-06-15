'use client'

export interface MockUser {
  id: string
  email: string
  full_name: string
}

export function getMockUser(): MockUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('mock_user')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function setMockUser(user: MockUser) {
  localStorage.setItem('mock_user', JSON.stringify(user))
}

export function clearMockUser() {
  localStorage.removeItem('mock_user')
}

export function mockLogin(email: string, password: string): MockUser | null {
  // Accept any email/password for demo
  if (!email || password.length < 4) return null
  const user: MockUser = {
    id: 'mock-' + Date.now(),
    email,
    full_name: email.split('@')[0],
  }
  setMockUser(user)
  return user
}

export function mockRegister(name: string, email: string, password: string): MockUser | null {
  if (!name || !email || password.length < 6) return null
  const user: MockUser = { id: 'mock-' + Date.now(), email, full_name: name }
  setMockUser(user)
  return user
}
