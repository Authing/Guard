import { LoggerType } from './interface'

let logger: Logger

export class Logger {
  public static printType = [LoggerType.ERROR]

  /**
   * 打印日志
   * @param message 日志信息
   * @param type 日志类型
   */
  public static log(message: string, type: LoggerType = LoggerType.INFO) {
    const log = {
      type,
      message
    }
    console.log(JSON.stringify(log))
  }

  public static info(message: string) {
    this.log(message, LoggerType.INFO)
  }

  public static warn(message: string) {
    this.log(message, LoggerType.WARN)
  }

  public static error(message: string) {
    this.log(message, LoggerType.ERROR)
  }
}

export const getLogger = () => {
  if (logger === undefined) logger = new Logger()

  return logger
}

export const useLogger = getLogger
