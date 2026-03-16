import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MapScreen from './src/views/MapScreen'

const DEV_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoia2lqb244NTczOUBmYXh6dS5jb20iLCJpYXQiOjE3NzM2NzAxOTcsImV4cCI6MTc3MzY3Mzc5N30.QpIKnOp_L98DBSCgx7jHsHvw0j9DvTkBDK8KzmGNrf4'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    AsyncStorage.setItem('auth_token', DEV_TOKEN).then(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <MapScreen />
    </SafeAreaProvider>
  )
}
