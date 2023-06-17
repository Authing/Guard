import { React } from 'shim-react'

import { SelectPanel } from './panel'

import {
  LoginWay,
  StoreInstance
} from '../../Guard/core/hooks/useMultipleAccounts'

import { GuardModuleType } from '../../Guard'

interface MultipleAccountsProps {
  /**
   * 多账号存储实例
   */
  multipleInstance?: StoreInstance
  /**
   * 切换 Guard 方法
   */
  changeModule?: (moduleName: GuardModuleType, initData?: any) => Promise<void>
  /**
   * 切换多账号状态
   */
  referMultipleState?: (
    type: 'login' | 'multiple',
    data?: { account: string; way: LoginWay }
  ) => void
}

const { useCallback, useState } = React

const MultipleAccountsFC: React.FC<MultipleAccountsProps> = props => {
  const [, setState] = useState<number>(0)
  const { multipleInstance, referMultipleState } = props

  // 默认只有一个多选实例
  const lists = multipleInstance?.getMemoUser()
  const forceUpdate = useCallback(() => setState(Math.random), [])

  if (!lists) {
    // 这里应该额外处理下 其实本质上应该是存在的
    return null
  }

  /**
   * 用户手动删除记录的用户
   */
  const handleDelAccount = (id: string) => {
    multipleInstance?.delUserById(id)
    const lists = multipleInstance?.getMemoUser()
    if (lists?.length === 0) {
      // 7.15: 如果仅剩一个需求跳转
      referMultipleState?.('login')
    } else {
      forceUpdate()
    }
  }

  /**
   * jump Login Page
   * 点击 li
   * 根据对应不同的内容进行回填上去
   */
  const changeState = (id: string | 'other') => {
    // way && account
    const data = multipleInstance?.getMemoSingleUser(id)
    referMultipleState?.('login', data)
  }

  return (
    <SelectPanel
      lists={lists}
      onClick={changeState}
      handleDel={handleDelAccount}
    />
  )
}

const MultipleAccounts = React.memo(MultipleAccountsFC)

export { MultipleAccounts }
