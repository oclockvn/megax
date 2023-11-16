import { Device } from "@/lib/models/device.model"

export type DeviceInfoState = {
  error: string | null,
  loadingState: string | null,
  device: Device | null,
}

type Action = {
  type: 'set',
  payload: Partial<DeviceInfoState>,
}

export default function deviceInfoReducer(state: DeviceInfoState, action: Action) {
  const updatedState: DeviceInfoState = {
    ...state
  }

  switch (action.type) {
    case 'set':
      return {
        ...updatedState,
        ...action.payload,
      }
  }
}
