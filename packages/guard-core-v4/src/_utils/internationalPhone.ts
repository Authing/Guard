import { countryPhoneData } from 'phone'

import { isoInfo } from './countryList'

// Only expose regions supported by the existing mobile-number validator.
export const internationalPhoneCountries = isoInfo.filter(info =>
  countryPhoneData.some(country => country.alpha2 === info.iso)
)
