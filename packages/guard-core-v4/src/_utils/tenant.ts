import { React } from 'shim-react'

import { ApplicationConfig } from '../Type'

const { useMemo } = React

/** **当前租户应用** 下的租户信息获取和操作处理，将租户相关的处理收拢 */
export class MultipleTenant {
  private $config: ApplicationConfig | null
  private $tenantId: string | null

  // 不直接使用变量而使用函数形式，是为了后续更加容易扩展并获取实时数据
  constructor(tenantId: string, config: ApplicationConfig) {
    this.$tenantId = tenantId ?? null
    this.$config = config ?? null
  }

  /** 获取租户ID */
  public getCurrentTenantId = () => {
    return this.$tenantId
  }

  /** 获取租户详情 */
  public getCurrentTenantInfo = () => {
    return this.$config?.tenantInfo
  }

  /**是否为【租户控制台】 */
  public isTenantConsole = () => {
    return this.$config?.isTenantConsole
  }
  /** 是否为租户【单点登录】 */
  public isTenantSSO = () => {
    return this.$tenantId && this.$config?.isTenantDefault === false
  }
  /** 是否为租户【单点登录面板】 */
  public isTenantSSOLaunchPad = () => {
    return this.$tenantId && this.$config?.isTenantDefault === true
  }
}

/** 初始化多租户实例 */
export const useMultipleTenant = (
  tenantId: string,
  publicConfig: ApplicationConfig
) => {
  const tenantInstance = useMemo(() => {
    if (!publicConfig) return
    return new MultipleTenant(tenantId, publicConfig)
  }, [publicConfig, tenantId])
  return tenantInstance
}
