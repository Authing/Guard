let flowHandleStorage: string | undefined

export const getFlowHandle = () => {
  return flowHandleStorage
}

export const useFlowHandle = getFlowHandle

export const updateFlowHandle = (flowHandle: string) => {
  flowHandleStorage = flowHandle
}

export const useUpdateFlowHandle = updateFlowHandle
