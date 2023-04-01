import { getDefaultG2Config, IG2Config, IG2Events, IG2FCProps } from '../Type'

export interface DownloadATConfig extends IG2Config {}

const defaultConfig: DownloadATConfig = {
  ...getDefaultG2Config()
}

export const getDefaultDownloadAuthenticatorConfig = (): DownloadATConfig => ({
  ...getDefaultG2Config(),
  ...defaultConfig
})

export interface DownloadATEvents extends IG2Events {}

export interface GuardDownloadATProps extends IG2FCProps, DownloadATEvents {
  config: Partial<DownloadATConfig>
}

export interface GuardDownloadATViewProps extends GuardDownloadATProps {
  config: DownloadATConfig
}
