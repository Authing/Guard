import { useEffect } from 'react'
import { React } from 'shim-react'
import { useGuardHttpClient } from '../../../_utils'
const { useState } = React

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const httpClient = useGuardHttpClient()

  useEffect(() => {
    const device_id =
      httpClient.getHeaders()['x-authing-device-id'] ||
      localStorage.getItem('browserId')
    setDeviceId(device_id)
  }, [])
  return deviceId
}
