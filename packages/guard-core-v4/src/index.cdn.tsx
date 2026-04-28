import { GuardFactory as GuardFactoryClass } from './GuardFactory'

export { GuardFactoryClass as GuardFactory, GuardFactoryClass as Guard }

export * from './GuardFactory'

// 手动挂载到 window，确保 CDN 使用方式与 v5.2.0 一致
if (typeof window !== 'undefined') {
  ;(window as any).GuardFactory = GuardFactoryClass
  ;(window as any).Guard = GuardFactoryClass
}

export default GuardFactoryClass
