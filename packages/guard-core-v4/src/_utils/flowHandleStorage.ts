let flowHandleStorage: string | undefined
let triggerIdStorage: string | undefined
let workflowIdStorage: string | undefined
export const getFlowHandle = () => {
  return flowHandleStorage
}

export const getTriggerId = () => {
  return triggerIdStorage
}

export const getWorkflowId = () => {
  return workflowIdStorage
}

export const useFlowHandle = getFlowHandle
export const useTriggerId = getTriggerId
export const useWorkflowId = getWorkflowId

export const updateFlowHandle = (flowHandle: string) => {
  flowHandleStorage = flowHandle
}
export const updateTriggerId = (triggerId: string) => {
  triggerIdStorage = triggerId
}

export const updateWorkflowId = (workflowId: string) => {
  workflowIdStorage = workflowId
}
export const useUpdateFlowHandle = updateFlowHandle
export const useUpdateTriggerId = updateTriggerId
export const useUpdateWorkflowId = updateWorkflowId
