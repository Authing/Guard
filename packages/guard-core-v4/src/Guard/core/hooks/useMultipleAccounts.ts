/* eslint-disable prettier/prettier */
/**
 * 整体的思路：
 * 在所有登录方式中，当进行登录时保存登录方式（FE侧自定义）
 * 之后在登录成功（onLogin）中，触发store的方法保存用户信息以及对应的登录方式进入localStorage。
 * 当用户再次打开页面时，拿出数据进行对比。（主要对比 LoginWay ），TODO: 这里的代码主要显得乱的原因是因为枚举的不正当使用。（主要要和Server端进行互相映射，后续维护时可优化）
 *
 * 核心思路：登录成功时，保存的FE侧自定义 LoginWay
 * 再次打开页面时，初始化时先根据 FE 自定义的 LoginWay 跳转到不同的 tab 下（way）下使用 account 进行回填。TODO: 这里也可优化，应该在登录成功时候就进行 LoginWay 的格式化，而非转来转去。（但是这样无法直观的体现是哪种方式进行登录）
 */

import { React } from 'shim-react'

import cloneDeep from 'lodash/cloneDeep'

import { SelectOptions } from '../../../Login/multipleAccounts/panel'

import { getPublicConfig } from '../../../_utils/config'

import { getPhoneInLoginPageContext } from '../../../_utils'

const { useCallback, useEffect, useMemo, useState } = React

const MULTIPLE_ACCOUNT_KEY = '__authing__multiple_accounts'

// 多账号计算 way 方式
const MULTIPLE_ACCOUNT_LISTS: LoginWay[] = [
  'email',
  'phone',
  'password',
  'phone-code',
  'email-code',
  'ad',
  'ldap',
  'ldap-password',
  'ldap-email',
  'ldap-phone'
]

// 扫码登录方式
export const QR_CODE_WAY: LoginWay[] = [
  'wechat-miniprogram-qrcode',
  'wechatmp-qrcode',
  'app-qrcode'
]

// 展示多账号时 默认排除的登录方式
const EXCLUDE_CODE_WAY: LoginWay[] = QR_CODE_WAY.concat('social')

/**
 * 登录时所有支持的登录列表(前端定义列表)
 * 这里稍微有点乱 因为Login中的登录方式和这里的不匹配，暂时放在了一起
 */
export type LoginWay =
  | 'email' // 邮箱密码登录
  | 'phone' // 手机号密码登录
  | 'password' // 用户名登录 | 自定义扩展字段登录
  | 'phone-code' // 手机号验证码登录
  | 'email-code' // 邮箱验证码登录
  | 'social' // 社会化登录
  | 'wechat-miniprogram-qrcode' // 小程序扫码登录
  | 'wechatmp-qrcode' // 公众号扫码登录方式
  | 'app-qrcode' // App 扫码登录方式
  | 'ad' // AD 登录方式
  | 'ldap' // LDAP 登录方式
  | 'ldap-password'
  | 'ldap-email'
  | 'ldap-phone'
  | 'authing-otp-push'

/**
 * when： 多账号页面跳转进入登录页面
 * 携带的回填数据信息
 */
export interface BackFillMultipleState
  extends Omit<
    User,
    | 'id'
    | 'name'
    | 'nickname'
    | 'username'
    | 'phone'
    | 'email'
    | 'photo'
    | '_updateTime'
  > {
  /**
   * 回填的账号名称 邮箱/用户名/手机
   */
  account: string
}

/**
 * Store instance
 */
export type StoreInstance = ReturnType<MultipleAccount['getStore']>

/**
 * originStore 类型
 */
interface MultipleStore {
  [appId: string]: CurrentStore
}

/**
 * 当前 userId 对应的类型
 */
export interface CurrentStore {
  [id: string]: User
}

export interface User {
  /**
   * userId
   */
  id: string
  /**
   * Tab 栏状态
   */
  tab: 'input' | 'qrcode'
  /**
   * 登录方式
   */
  way: LoginWay
  /**
   * 姓名
   */
  name?: string | null
  /**
   * 昵称
   */
  nickname?: string | null
  /**
   * 用户名
   */
  username?: string | null
  /**
   * 手机号
   */
  phone?: string | null
  /**
   * 邮箱
   */
  email?: string | null
  /**
   * 头像
   */
  photo?: string | null
  /**
   * qrCodeId 对应的ID
   */
  qrCodeId?: string
  /**
   * 国际化短信区号
   */
  phoneCountryCode?: string
  /**
   * 国际化短信选择框回填
   */
  areaCode?: string
  /**
   * 登录时间
   */
  _updateTime?: string
}

class MultipleAccount {
  /**
   * 原始的登录账号
   */
  private originAccount = ''
  private originWay = ''
  /**
   * 原始的 localStore 值
   */
  private originStore: MultipleStore = {}
  /**
   * 当前 AppId Store
   */
  private currentStore: MultipleStore[string] = {}
  /**
   * 单账号直接回填
   */
  private firstBackFillData?: BackFillMultipleState
  /**
   * server 返回支持的登录方式
   */
  private serverSideLoginMethods: LoginWay[]

  /**
   * 是否显示多账号登录页面
   * true 存在
   */
  private memberState: boolean
  /**
   * 二维码登录时的ID
   */
  private qrCodeId?: string
  /**
   * 国际化短信前缀 区号
   */
  private phoneCountryCode?: string
  /**
   * 国际化短信前缀 选中地区编号
   */
  private areaCode?: string
  private tabStatus?: 'qrcode' | 'input'
  /**
   * 当前登录二级状态
   */
  private loginWay?: LoginWay
  private appId: string
  /**
   * 是否开启国际化短信
   */
  private isInternationSms?: boolean

  constructor() {
    // 二级别Tab
    this.loginWay = undefined
    // 一级Tab
    this.tabStatus = undefined
    this.qrCodeId = undefined
    // 国际化短信
    this.phoneCountryCode = undefined
    this.areaCode = undefined

    this.originStore = {}
    this.currentStore = {}

    this.appId = ''
    this.memberState = false
    this.firstBackFillData = undefined
    this.serverSideLoginMethods = []
  }

  /**
   * 页面首次加载时初始化 Store
   * 从 LocalStore 中拿值 放到这里来
   */
  private initStore = (
    appId: string,
    options: {
      serverSideLoginMethods: LoginWay[]
      isInternationSms: boolean
    }
  ) => {
    const { serverSideLoginMethods, isInternationSms } = options
    this.appId = appId
    this.isInternationSms = isInternationSms
    this.serverSideLoginMethods = serverSideLoginMethods
    // TODO: 单独抽离 utils 方法 localStorage
    this.originStore =
      JSON.parse(localStorage.getItem(MULTIPLE_ACCOUNT_KEY) || '{}') || {}

    // 当前 Appid 中所有的内容
    this.currentStore = this.getCurrentStore(this.originStore)
    // 初始化回填页面 & 回填数据
    const { backfillData, memberState } = this.initMemberState()
    this.firstBackFillData = backfillData
    this.memberState = memberState
  }

  /**
   * 初始化记住账号相关信息
   * @param normalCount
   * @returns
   */
  private initMemberState = () => {
    // 获取到对应的 验证码个数，默认的个数
    const { qrCount, normalCount } = this.memberStateCount()
    // 登录是否渲染多账号状态
    let memberState = false
    // 需要回填的数据
    let backfillData: BackFillMultipleState | undefined
    if (normalCount > 1) {
      // 多个有效的账号
      memberState = true
    } else if (normalCount === 1) {
      // 单个有效账号
      backfillData = this.initBackfillData('input')
      memberState = false
    } else if (qrCount >= 1) {
      // 仅有二维码
      memberState = false
      backfillData = this.initBackfillData('qrCode')
    }
    return {
      memberState,
      backfillData
    }
  }

  /**
   * 获取当前ID下有效账号个数
   * @returns qrCount 有效的二维码登录个数 normalCount 有效的账号登录方式
   */
  private memberStateCount = () => {
    let qrCount = 0
    let normalCount = 0
    const values = Object.values(this.currentStore)
    for (const value of values) {
      const { tab } = value
      // 1. 扫码登录
      if (tab === 'qrcode') {
        qrCount++
      }
      // 2. 正常回填的个数
      if (tab === 'input') {
        normalCount++
      }
    }
    return {
      qrCount,
      normalCount
    }
  }

  /**
   * 初始化第一次的数据 TODO: 逻辑有点脏 待整理
   */
  private initBackfillData = (initWay: 'qrCode' | 'input') => {
    // TODO: backfillData 回填时考虑 AD 和  LDAP 对应的账号
    const wayLists = initWay === 'qrCode' ? QR_CODE_WAY : MULTIPLE_ACCOUNT_LISTS
    const userLists = Object.values(this.currentStore)
    const user = userLists.find(i => wayLists.includes(i.way))
    // 如果是扫码的用户 回填状态就可以了
    if (user && wayLists.includes(user.way)) {
      const data =
        initWay === 'qrCode'
          ? {
              account: '',
              way: user.way
            }
          : this.getAccountByWay(user.way, user)

      return {
        ...data,
        tab: user.tab,
        qrCodeId: user.qrCodeId,
        phoneCountryCode: user.phoneCountryCode,
        areaCode: user.areaCode
      }
    }
  }

  /**
   * 根据前端存储的登录方式返回后端映射方式
   * @param front
   */
  private getServerLoginMethodByFront = (front: LoginWay) => {
    // 排除 social 方式 TODO: Mappint 常量抽离
    const mapping: Record<Exclude<LoginWay, 'social'>, string> = {
      ldap: 'ldap',
      'ldap-password': 'ldap',
      'ldap-phone': 'ldap',
      'ldap-email': 'ldap',
      ad: 'ad',
      email: 'email-password',
      password: 'username-password',
      phone: 'phone-password',
      'email-code': 'phone-code',
      'phone-code': 'phone-code',
      'wechat-miniprogram-qrcode': 'wechat-miniprogram-qrcode',
      'wechatmp-qrcode': 'wechatmp-qrcode',
      'app-qrcode': 'app-qrcode',
      'authing-otp-push': 'authing-otp-push'
    }
    if (front !== 'social') {
      return mapping[front]
    }
  }

  /**
   * 当前 Store  DONE
   */
  private getCurrentStore = (originStore: MultipleStore) => {
    const currentStore = originStore[this.appId] || {}
    const serverSideLoginMethods = this.serverSideLoginMethods
    const result = Object.create(null)

    for (const [key, value] of Object.entries(currentStore)) {
      // 1. 过滤 Server 关闭的账号
      const passMethod = this.validateMethod(value, serverSideLoginMethods)
      // 2. 校验国际化短信 过滤
      const passMsm = this.validateInternationSms(value)
      if (passMsm && passMethod) {
        result[key] = cloneDeep(value)
      }
    }
    return result
  }

  /**
   * 国际化短信过滤
   * true 表示通过 需要保留
   * false 表示不通过 需要过滤
   */
  private validateInternationSms = (user: User) => {
    if (user.way !== 'phone-code') {
      return true
    }
    const isInternationSms = this.isInternationSms
    const { phoneCountryCode, areaCode } = user
    // 这个用户是否是国际化短信登录
    const currentIsInternationSms = phoneCountryCode || areaCode
    return isInternationSms ? currentIsInternationSms : !currentIsInternationSms
  }

  /**
   * 校验有效的登录方式账号
   * @param user
   * @param serverSideLoginMethods
   * @returns
   */
  private validateMethod = (user: User, serverSideLoginMethods: LoginWay[]) => {
    const { way } = user
    const serverWay = this.getServerLoginMethodByFront(way)
    const validateInternationSms = this.validateInternationSms(user)
    return (
      validateInternationSms &&
      serverWay &&
      serverSideLoginMethods.includes(serverWay as any)
    )
  }

  /**
   *
   * @param tab 一级Tab状态
   * @param way 二级Tab状态
   * @param id 二维码登录时 记录对应的二维码 ID
   */
  private setLoginWay = (
    tab: 'input' | 'qrcode',
    way: LoginWay,
    id?: string,
    internation?: {
      phoneCountryCode: string
      areaCode: string
    }
  ) => {
    this.tabStatus = tab
    this.loginWay = way
    this.qrCodeId = id
    // 国际化短信的区号
    if (internation) {
      const { phoneCountryCode, areaCode } = internation
      this.phoneCountryCode = phoneCountryCode
      this.areaCode = areaCode
    }
  }

  /**
   * 设置/更新 store 内的用户信息
   */
  private setUserInfo = (
    user: Omit<
      User & { id: string; loginAccount?: string; usertype?: string },
      'way' | 'tab' | 'phoneCountryCode'
    > // 添加扩展字段登录名
  ) => {
    // 排除 ad 登录方式
    if (!user || !this.loginWay || !this.tabStatus || this.loginWay === 'ad') {
      console.log('User or LoginWay does not exist.')
      return
    }
    const {
      photo,
      nickname,
      phone,
      username,
      email,
      id,
      name,
      loginAccount,
      usertype
    } = user
    if (usertype !== '2') {
      this.currentStore[id] = Object.assign({
        way: this.loginWay, // 登录方式
        tab: this.tabStatus, // 当前大tab 扫码 or 输入
        photo,
        nickname,
        phone,
        username: loginAccount || username,
        usertype,
        name,
        email,
        id,
        qrCodeId: this.qrCodeId,
        phoneCountryCode: this.phoneCountryCode,
        areaCode: this.areaCode,
        _updateTime: Date.now()
      })
      this.saveStore()
    }
  }

  /**
   * 持久化保存
   */
  private saveStore = () => {
    const newStore = Object.assign({}, this.originStore, {
      [this.appId]: this.currentStore
    })
    localStorage.setItem(MULTIPLE_ACCOUNT_KEY, JSON.stringify(newStore))
  }

  /**
   * 根据登录的 account 判断本次登录的方式
   * @param account 登录输入的账号
   * @param param1 登录成功返回的相关信息 用户名/手机号/邮箱
   * @returns
   */
  private setLoginWayByHttpData = (
    account: string,
    data: {
      username?: string
      phone?: string
      email?: string
    }
  ) => {
    // TODO: 临时保存对应的account
    this.originAccount = account
    this.originWay = 'password'
    const { username, phone, email } = data
    switch (account) {
      case username:
        return this.setLoginWay('input', 'password')
      case phone:
        return this.setLoginWay('input', 'phone')
      case email:
        return this.setLoginWay('input', 'email')
      default:
        return this.setLoginWay('input', 'password')
    }
  }

  /**
   * 根据登录的 account 判断本次LDAP登录方式
   * @param account 登录输入的账号
   * @param param1 登录成功返回的相关信息 用户名/手机号/邮箱
   * @returns
   */
  private setLoginWayByLDAPData = (
    account: string,
    data: {
      name?: string
      phone?: string
      email?: string
    }
  ) => {
    this.originAccount = account
    this.originWay = 'ldap'
    const { name, phone, email } = data
    switch (account) {
      case name:
        return this.setLoginWay('input', 'ldap-password')
      case phone:
        return this.setLoginWay('input', 'ldap-phone')
      case email:
        return this.setLoginWay('input', 'ldap-email')
      // MFA 情况都不匹配，那么直接处理 name
      default:
        return this.setLoginWay('input', 'ldap-password')
    }
  }

  /**
   * 根据用户 ID 删除 localStorage 中当前用户 ID
   */
  private delUserById = (id: string) => {
    // 1. 在 current Store 中删除当前ID
    if (id in this.currentStore) {
      delete this.currentStore[id]
      // 2. 更新 localStorage
      this.saveStore()
    }
    return id
  }

  /**
   * 获得多账号登录页面的所有用户列表
   * @param excludeWays
   */
  private getMemoUser = (excludeWays: LoginWay[] = EXCLUDE_CODE_WAY) => {
    const currentStore = this.currentStore
    const result: SelectOptions[] = []

    for (const item of Object.values(currentStore)) {
      const { way } = item
      const value = this._mappingUser(item)
      if (!excludeWays.includes(way)) {
        result.push(value)
      }
    }
    // 这里没有过滤
    return result.sort((a, b) => b._updateTime - a._updateTime).slice(0, 3)
  }

  /**
   * 根据 id 获得当前已登录的用户信息
   * @param userId
   * @returns User / undefined
   */
  private getMemoSingleUser: (
    id: string
  ) => { way: LoginWay; account: string } | undefined = (userId: string) => {
    // 根据登录方式进行过滤映射
    const currentUser = this.currentStore[userId]
    if (currentUser) {
      // 根据登录方式进行处理
      const { way, phoneCountryCode, areaCode } = currentUser
      const { account, way: parseWay } = this.getAccountByWay(way, currentUser)
      return {
        account,
        way: parseWay,
        // fix: 回填时需要携带国际化信息。
        phoneCountryCode,
        areaCode
      }
    }
  }

  /**
   * 该方法仅仅需要回填账号的登录方式，其他都不计入
   * 当用户名/手机号/邮箱/AD/LDAP 相同时，根据登录顺序匹配不同的账号
   * 根据记住的用户登录方式获取对应的登录账户名
   * @param way
   * @param user
   * @returns
   */
  private getAccountByWay: (
    way: LoginWay,
    user: User
  ) => { way: LoginWay; account: string } = (way: LoginWay, user: User) => {
    const { email, phone, username, name } = user
    // 开启国际化短信后 邮箱验证码方式作为单独tab 未开启时和短信验证码共用一个
    const emailCode = this.isInternationSms ? 'email-code' : 'phone-code'
    // 根据对应的 LoginWay 进行返回
    switch (way) {
      case 'email':
        return { account: email!, way: 'password' }
      case 'email-code':
        return { account: email!, way: emailCode }
      case 'phone-code':
        return { account: phone!, way: 'phone-code' }
      case 'phone':
        return { account: phone!, way: 'password' }
      case 'password':
        return { account: username!, way: 'password' }
      case 'ad':
        return { account: name!, way: 'ad' }
      case 'ldap-password':
        return { account: name!, way: 'ldap' }
      case 'ldap-email':
        return { account: email!, way: 'ldap' }
      case 'ldap-phone':
        return { account: phone!, way: 'ldap' }
      case 'authing-otp-push':
        return { account: username! || phone!, way: 'authing-otp-push' }
      default:
        throw new Error('已登录用户匹配不到的登录方式')
    }
  }

  private _mappingUser = (value: User) => {
    const {
      id,
      photo,
      name,
      nickname,
      username,
      email,
      phone,
      _updateTime,
      phoneCountryCode,
      way
    } = value
    // 1. 姓名 > 昵称 > username
    const title = name || nickname || username || undefined
    // 2. 处理手机号是否是国家化显示
    const parsePhone = phoneCountryCode ? `${phoneCountryCode} ${phone}` : phone
    // 3. phone > email
    const description = parsePhone || email || undefined
    return {
      title,
      description,
      id,
      photo: photo || '',
      // 国际化  phoneCountryCode
      _updateTime: parseInt(_updateTime || '0'),
      way
    }
  }

  /**
   * 外部暴露方法
   */
  getStore = () => {
    return {
      initStore: this.initStore,
      // 当前登录方式
      setLoginWay: this.setLoginWay,
      // 设置用户信息
      setUserInfo: this.setUserInfo,
      // TODO: 脏逻辑
      setLoginWayByHttpData: this.setLoginWayByHttpData,
      setLoginWayByLDAPData: this.setLoginWayByLDAPData,
      // 获得当前 AppId 下对应的数据
      getMemoUser: this.getMemoUser,
      // 获得当前 userId 下的对应单个用户信息
      getMemoSingleUser: this.getMemoSingleUser,
      // 删除记录的登录账号
      delUserById: this.delUserById,
      // 是否存在已经登陆账号 > 1
      getMemberState: () => this.memberState,
      // 首次需要回填的数据 单账号记住登录下
      getFirstBackFillData: () => this.firstBackFillData,
      // 原始的登录账号和密码
      getOriginAccount: () => this.originAccount,
      getOriginWay: () => this.originWay
    }
  }
}

/**
 * MultipleAccounts 相关 Hook
 * Finally Config 类型过滤
 */
const useMultipleAccounts = ({
  appId,
  finallyConfig
}: {
  appId?: string
  finallyConfig?: any
}) => {
  // 页面状态，两种 'isMultipleAccount' TODO: 改成 reducer
  const [isMultipleAccount, setMultipleAccount] = useState(false)
  // 页面记住的数据 给一个初始值
  const [multipleAccountData, setMultipleAccountData] = useState<
    undefined | BackFillMultipleState
  >(undefined)

  const [storeInstance, setStoreInstance] = useState<StoreInstance | undefined>(
    undefined
  )

  /**
   * 修改登录页是否是多账号登录的状态
   */
  const changeMultipleState = useCallback((type: 'login' | 'multiple') => {
    const boolean = type === 'multiple'
    setMultipleAccount(boolean)
  }, [])

  /**
   * 当从账号进入登录页时，更新登录页需要回填的信息
   * 账号信息 & 登录方式
   */
  const updateBackFillData = useCallback((data: BackFillMultipleState) => {
    // 当访完成一次之后 立即清空该数据
    setMultipleAccountData(data)
  }, [])

  /**
   * 清空数据
   */
  const clearBackFillData = useCallback(() => {
    setMultipleAccountData(undefined)
  }, [])

  /**
   * 更新页面状态 & 数据回填
   */
  const referMultipleState = useCallback(
    (type: 'login' | 'multiple', data?: BackFillMultipleState) => {
      changeMultipleState(type)
      if (data) {
        // updateBackFillData
        updateBackFillData(data)
      }
    },
    [updateBackFillData, changeMultipleState]
  )

  /**
   * 初始化数据 & 初始化登录页面渲染状态
   */
  const initFirstState = useCallback(
    (storeInstance: StoreInstance) => {
      const type = storeInstance.getMemberState() ? 'multiple' : 'login'
      // 根据初始值 初始化数据
      referMultipleState(type, storeInstance.getFirstBackFillData())
    },
    [referMultipleState]
  )

  useEffect(() => {
    if (!appId || !finallyConfig) {
      return
    }

    // login_page_context 中有 phone 字段，说明是从官网带着手机号跳转过来的
    // 要定位到手机号验证码登录模块
    const phone = getPhoneInLoginPageContext()
    if (phone) {
      return
    }

    const publicConfig = getPublicConfig(appId)

    if (!publicConfig?.enableLoginAccountSwitch) {
      return
    }
    // 最终支持的登录方式 用于过滤有效登录方式
    const serverSideLoginMethods = finallyConfig?.loginMethods || []
    // 输入框 邮箱/用户名/手机号 + 密码
    const configLists = finallyConfig?.passwordLoginMethods || []
    // 是否支持国际化短信
    const isInternationSms =
      publicConfig?.internationalSmsConfig?.enabled || false
    // 创建实例
    const instance = new MultipleAccount()
    // 获取实例
    const storeInstance = instance.getStore()
    // 增加一个多的 国际化短信是否开启
    storeInstance.initStore(appId, {
      serverSideLoginMethods: [...configLists, ...serverSideLoginMethods],
      isInternationSms
    })
    setStoreInstance(storeInstance)
    // 根据 instance 中的状态和数据初始化登录页面状态
    initFirstState(storeInstance)
  }, [appId, finallyConfig, referMultipleState, initFirstState])

  return useMemo(() => {
    return {
      instance: storeInstance,
      isMultipleAccount,
      referMultipleState,
      multipleAccountData,
      clearBackFillData
    }
  }, [
    storeInstance,
    isMultipleAccount,
    referMultipleState,
    multipleAccountData,
    clearBackFillData
  ])
}

export default useMultipleAccounts
