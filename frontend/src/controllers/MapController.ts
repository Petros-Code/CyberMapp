import * as Location from 'expo-location'
import { locationModel } from '../models/LocationModel'
import { UserOnMap } from '../types'

class MapController {
  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync()
    return status === 'granted'
  }

  async getMyPosition(): Promise<Location.LocationObject | null> {
    const granted = await this.requestPermissions()
    if (!granted) return null
    return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
  }

  async updateMyLocation(): Promise<void> {
    const position = await this.getMyPosition()
    if (!position) return
    const { latitude, longitude } = position.coords
    await locationModel.updateMyLocation(latitude, longitude)
  }

  async getUsersOnMap(): Promise<UserOnMap[]> {
    return locationModel.getAll()
  }
}

export const mapController = new MapController()
