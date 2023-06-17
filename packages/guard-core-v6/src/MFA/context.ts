import { React } from 'shim-react'

interface MFABackStateContextType {
  setMfaBackState: React.Dispatch<React.SetStateAction<string>>
  mfaBackState: string
}

export const MFABackStateContext = React.createContext<
  MFABackStateContextType | undefined
>(undefined)
