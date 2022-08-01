import { useRef } from 'react'
import { Guard } from 'guard.js'

const useGuard = (options: any = {}): [Guard, any] => {

  const instance = useRef<Guard | null>(null)


  if (!instance.current) {
    instance.current = new Guard(options)
  }

  //  TODO: 类型补充 设置 options 时，重新整体渲染 Guard 组件算了
  // 不考虑其他兼容性了
  const setOptions = (guardOptions: any) => {

  }

  return [instance.current, setOptions]
}

export {
  useGuard
}