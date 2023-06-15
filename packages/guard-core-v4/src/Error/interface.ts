export interface ErrorInitData {
  error?: Error
}

export interface GuardErrorProps {
  initData?: ErrorInitData
}

export interface GuardErrorViewProps extends GuardErrorProps {}
