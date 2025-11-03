import {
  create as createWebauthnCredential,
  get as getWebauthnCredential,
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON
} from '@github/webauthn-json'

export const registerPasskey = async (
  challenge: CredentialCreationOptionsJSON
) => {
  try {
    const attestation = await createWebauthnCredential(challenge)
    return attestation
  } catch (error) {
    console.warn('browser register passkey error: ', error)
  }
}

export const verifyPasskey = async (
  challenge: CredentialRequestOptionsJSON
) => {
  try {
    challenge.publicKey?.allowCredentials &&
      delete challenge.publicKey.allowCredentials
    const attestation = await getWebauthnCredential({
      ...challenge,
      mediation: 'required'
    })
    return attestation
  } catch (error) {
    console.warn('browser verify passkey error: ', error)
  }
}
