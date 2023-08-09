import { React } from 'shim-react'

import { Agreement } from '../../../Type'

const { useEffect } = React

interface Options {
  agreements: Agreement[]
  checkedAgreements: (string | number)[]
  checkAllAgreements: () => void
  unCheckAllAgreements: () => void
}

export function useAgreements(options: Options) {
  const {
    agreements,
    checkedAgreements,
    checkAllAgreements,
    unCheckAllAgreements
  } = options

  const agreementsContext = {
    agreements,
    checkedAgreements,
    checkAllAgreements,
    unCheckAllAgreements
  }

  useEffect(() => {
    window.$$guard = Object.assign({}, window.$$guard, {
      agreementsContext
    })
  }, [agreements, checkedAgreements])

  return agreementsContext
}
