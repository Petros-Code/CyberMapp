import { apiService } from '../services/ApiService'
import { UserOnMap } from '../types'

class LocationModel {
  async getAll(): Promise<UserOnMap[]> {
    const res = await apiService.get<{ success: boolean; data: UserOnMap[] }>('/api/location/')
    return res.data
  }

  async updateMyLocation(latitude: number, longitude: number): Promise<void> {
    await apiService.post('/api/location/update', { latitude, longitude })
  }
}

export const locationModel = new LocationModel()
