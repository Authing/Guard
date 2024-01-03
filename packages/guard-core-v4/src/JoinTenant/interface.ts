export interface Props {
  onBack: () => void
}

export enum JoinTenantStepEnum {
  InputTenantCode = 'inputTenantCode',
  InputEnterpriseEmail = 'inputEnterpriseEmail',
  VerifyEmailCode = 'verifyEmailCode',
  NoEnterpriseDomain = 'noEnterpriseDomain',
  JoinSuccess = 'joinSuccess',
  JoinFailed = 'joinFailed'
}
