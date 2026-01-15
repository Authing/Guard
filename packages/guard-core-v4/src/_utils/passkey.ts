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
    console.log(challenge, 'challenge')
    const attestation = await createWebauthnCredential(challenge)
    console.log(attestation, challenge, 'registerPasskey')
    return attestation
  } catch (error) {
    console.warn('browser register passkey error: ', error)
  }
}

export const verifyPasskey = async (
  challenge: CredentialRequestOptionsJSON
) => {
  try {
    const attestation = await getWebauthnCredential({
      mediation: 'required',
      ...challenge
    })
    return attestation
  } catch (error) {
    console.warn('browser verify passkey error: ', error)
  }
}
