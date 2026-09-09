import { countryPhoneData } from 'phone'

import { isoInfo } from './countryList'

// Only expose regions supported by the existing mobile-number validator.
export const internationalPhoneCountries = isoInfo.filter(info =>
  countryPhoneData.some(country => country.alpha2 === info.iso)
)

// A country may have several selectable prefixes while its ISO code stays the same.
export const internationalPhoneOptions = internationalPhoneCountries.flatMap(
  country =>
    (country.areaCodes?.length ? country.areaCodes : ['']).map(areaCode => ({
      ...country,
      areaCode,
      selection: areaCode ? `${country.iso}:${areaCode}` : country.iso,
      dialPrefix: country.phoneCountryCode + areaCode
    }))
)

export const getPhoneInputValue = (country: string, value: string) => {
  const options = internationalPhoneOptions.filter(
    option => option.iso === country
  )
  const digits = value.replace(/[\s().-]/g, '')
  const national = digits.startsWith('+1')
    ? digits.slice(2)
    : digits.length === 11 && digits.startsWith('1')
    ? digits.slice(1)
    : digits
  const matching = options.find(
    option => option.areaCode && national.startsWith(option.areaCode)
  )
  return {
    selection: (matching ?? options[0])?.selection ?? country,
    value: matching ? national.slice(matching.areaCode.length) : value
  }
}

export const toPhoneFormValue = (selection: string, value: string) => {
  const option = internationalPhoneOptions.find(
    item => item.selection === selection
  )
  if (!option?.areaCode || !value) return value
  const digits = value.replace(/[\s().-]/g, '')
  // Preserve complete pasted numbers (including invalid ones) for the existing validator.
  if (digits.startsWith('+1') && digits.length === 12) return digits.slice(2)
  if (digits.startsWith('1') && digits.length === 11) return digits.slice(1)
  if (digits.startsWith('+') || digits.length >= 10) return digits
  return option.areaCode + digits
}
