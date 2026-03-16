import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '../constants'

class ApiService {
  private async getToken(): Promise<string | null> {
    return AsyncStorage.getItem('auth_token')
  }

  private async request<T>(method: string, path: string, body?: object): Promise<T> {
    const token = await this.getToken()

    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }

  get<T>(path: string) { return this.request<T>('GET', path) }
  post<T>(path: string, body: object) { return this.request<T>('POST', path, body) }
  delete<T>(path: string) { return this.request<T>('DELETE', path) }
}

export const apiService = new ApiService()
