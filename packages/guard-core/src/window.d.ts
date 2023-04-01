declare interface Window {
  $$guard: {
    viewContext?: {
      changeModule?: (moduleName: GuardModuleType, initData?: any) => Promise<void>
      changeTab?: Dispatch<any>
      currentModule?: string
      currentTab?: string
      currentView?: string
    }
    agreementsContext?: {
      agreements: Agreement[]
      checkedAgreements: (string | number)[]
      checkAllAgreements: () => void
      unCheckAllAgreements: () => void
    }
  }
}
