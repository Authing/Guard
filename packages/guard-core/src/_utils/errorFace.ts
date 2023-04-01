enum FaceErrorName {
  NotAllowedError = 'NotAllowedError',
  AbortError = 'AbortError',
  NotReadableError = 'NotReadableError',
  OverconstrainedError = 'OverconstrainedError',
  SecurityError = 'SecurityError'
}

export interface FaceErrorMessage extends DOMException {
  name: FaceErrorName
}

export const faceErrorMessage = (error: FaceErrorMessage) => {
  let message = ''
  switch (error.name) {
  case FaceErrorName.NotAllowedError:
    message = 'login.AuthorizationCamera'
    break
  case FaceErrorName.SecurityError:
    message = 'login.checkPreferences'
    break
  case FaceErrorName.OverconstrainedError:
    message = 'login.requireError'
    break
  default:
    message = 'login.hardwareSupport'
  }
  return message
}
