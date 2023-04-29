import { React } from 'shim-react'

import { CodeStatus } from '../UiQrCode'

export type ReducerType = 'change' | 'changeStatus' | 'changeDesc'

export type RootState = {
  /**
   * 状态
   */
  status: CodeStatus
  /**
   * 底部描述
   */
  // description: React.ReactNode
  /**
   * 当前二维码 URL
   */
  src?: string
  /**
   * 二维码随机值
   */
  random?: string
}

const { useReducer } = React

const reducer = (
  state: RootState,
  action: {
    type: ReducerType
    payload: Partial<RootState>
  }
) => {
  switch (action.type) {
    case 'changeStatus':
      if (state.status === action.payload.status) {
        return state
      }
      return { ...state, ...action.payload }
    // case 'changeDesc':
    //   if (state.description === action.payload.description) {
    //     return state
    //   }
    //   return { ...state, ...action.payload }
    case 'change':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

/**
 * QrCode 准备阶段 Hook
 */
const usePreQrCode = () => {
  /**
   * reducer 控制
   */
  const [state, dispatch] = useReducer(reducer, {
    status: 'loading',
    // description: '',
    src: undefined,
    random: undefined
  })

  return {
    state,
    dispatch
  }
}

export { usePreQrCode }
