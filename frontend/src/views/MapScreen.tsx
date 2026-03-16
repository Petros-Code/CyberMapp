import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { mapController } from '../controllers/MapController'
import { UserOnMap } from '../types'
import { COLORS, FONT_SIZES } from '../constants'

export default function MapScreen() {
  const [users, setUsers] = useState<UserOnMap[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMap()
  }, [])

  async function loadMap() {
    try {
      setLoading(true)
      setError(null)
      await mapController.updateMyLocation()
      const data = await mapController.getUsersOnMap()
      setUsers(data)
    } catch (e) {
      setError('Impossible de charger la carte')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: users[0]?.latitude ?? 48.8566,
          longitude: users[0]?.longitude ?? 2.3522,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        {users.map((user) => (
          <Marker
            key={user.user_id}
            coordinate={{ latitude: user.latitude, longitude: user.longitude }}
            title={user.username}
          />
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
  },
})
