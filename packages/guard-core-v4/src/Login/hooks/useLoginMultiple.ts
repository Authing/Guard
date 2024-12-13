import phone from 'phone'

import { FormInstance } from 'shim-antd/lib/form'

import { React } from 'shim-react'

import {
  BackFillMultipleState,
  LoginWay
} from '../../Guard/core/hooks/useMultipleAccounts'

import { useGuardAccountSelectInstance } from '../../_utils/context'

import { validate } from '../../_utils'
import { castArray } from 'lodash'

const { useEffect, useCallback, useRef, useLayoutEffect } = React

function matchWay(a: LoginWay[] | undefined, b: LoginWay | LoginWay[]) {
  if (!a) {
    return false
  }
  const arrB = castArray(b)
  return a.filter(Boolean).some(item => arrB.includes(item))
}

/**
 * 登录账号选择时：账户 & 登录方式自动回填
 * oidc 时：login_hint 回填账号
 *
 * TODO: HOOK 参数有时间整理成为对象，开始没有想到有这么多
 * 调用地方 core 中需要回填的两个登录方式
 */
function useLoginAccountBackFill(options: {
  form: FormInstance<any>
  way: LoginWay | LoginWay[]
  formKey: string
  backfillData?: BackFillMultipleState
  isOnlyInternationSms?: boolean
  setAreaCode?: React.Dispatch<React.SetStateAction<string>>
  cancelBackfill?: boolean
  changeCurrentMethod?: (account: string) => void
  loginHint?: string
}) {
  const {
    form,
    way,
    formKey,
    backfillData,
    isOnlyInternationSms,
    setAreaCode,
    cancelBackfill,
    changeCurrentMethod,
    loginHint
  } = options
  // 获得格式化后的回填 account，如果是国际化选择框，还需要改变对应选项
  const parseFillData = useCallback<
    () => {
      account: string
      areaCode: string | undefined
      matched: boolean
    }
  >(() => {
    // oidc login_hint 优先级更高
    if (loginHint) {
      const phoneRes = phone(loginHint)

      // 账号可以填手机号
      if (
        matchWay(
          ['ad', 'ldap', 'ldap-phone', 'phone', 'phone-code', 'password'],
          way
        ) &&
        (phoneRes.isValid || validate('phone', loginHint))
      ) {
        return {
          account: phoneRes.isValid ? phoneRes.phoneNumber : loginHint,
          areaCode: phoneRes.isValid ? phoneRes.countryCode : undefined,
          matched: true
        }
      }

      // 账号可以填邮箱
      if (
        matchWay(
          ['ad', 'ldap', 'ldap-email', 'email', 'email-code', 'password'],
          way
        ) &&
        validate('email', loginHint)
      ) {
        return {
          account: loginHint,
          areaCode: undefined,
          matched: true
        }
      }

      if (matchWay(['ad', 'ldap', 'password'], way)) {
        // 账号可以填用户名、邮箱、手机号
        return {
          account: loginHint,
          areaCode: undefined,
          matched: true
        }
      }

      return {
        account: '',
        areaCode: undefined,
        matched: false
      }
    } else if (backfillData && !cancelBackfill) {
      const prefix = isOnlyInternationSms
        ? ''
        : backfillData?.phoneCountryCode
          ? backfillData?.phoneCountryCode + ' '
          : ''

      const content = backfillData?.account || ''

      const account = prefix + content

      return {
        account,
        areaCode: backfillData?.areaCode,
        matched: matchWay([backfillData?.way], way)
      }
    }

    return {
      account: '',
      areaCode: undefined,
      matched: false
    }
  }, [isOnlyInternationSms, backfillData, loginHint])

  // initData 如果存在值表示已经回填过了
  useEffect(() => {
    const { account, areaCode, matched } = parseFillData()

    if (matched) {
      areaCode && setAreaCode?.(areaCode)
      changeCurrentMethod?.(account)

      form.setFieldsValue({
        [formKey]: account
      })
    }
  }, [
    backfillData,
    cancelBackfill,
    form,
    formKey,
    way,
    setAreaCode,
    parseFillData,
    changeCurrentMethod
  ])
}

/**
 * 多账号统一状态管理
 * @param setLoginWay
 * @returns
 */
function useLoginSelectAccount(setLoginWay: React.Dispatch<any>) {
  const multipleQrWay = useRef<string>()
  // 多账号实例
  const {
    instance: multipleInstance,
    referMultipleState,
    isMultipleAccount,
    multipleAccountData: backfillData
  } = useGuardAccountSelectInstance()

  const onBackFillData = useCallback(
    (data: BackFillMultipleState) => {
      const { way, qrCodeId } = data
      const qrCodeDefaultTab = qrCodeId ? way + qrCodeId : way
      multipleQrWay.current = qrCodeDefaultTab
      setLoginWay(way)
    },
    [setLoginWay]
  )

  // 没办法了 TODO: 我真的是没办法了... 只有Default方式去硬逻辑加载
  if (backfillData?.qrCodeId) {
    multipleQrWay.current = backfillData.way + backfillData?.qrCodeId
  }

  useLayoutEffect(() => {
    // 非多账号登录页面 并且存在返回值
    if (!isMultipleAccount && backfillData) {
      onBackFillData(backfillData)
    }
  }, [isMultipleAccount, backfillData, onBackFillData])

  return {
    isMultipleAccount,
    multipleInstance,
    referMultipleState,
    backfillData,
    defaultQrWay: multipleQrWay.current
  }
}

export { useLoginAccountBackFill, useLoginSelectAccount as useLoginMultiple }
