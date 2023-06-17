let guardDocument: Document

export const getGuardDocument = (): Document => {
  return guardDocument
}

export const useAppendConfig = getGuardDocument

export const initGuardDocument = (document: Document) => {
  guardDocument = document
}
