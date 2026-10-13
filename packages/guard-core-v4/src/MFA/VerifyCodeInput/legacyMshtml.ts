// The MDM enrollment broker can render Guard in IE11 document mode.
export const isLegacyMshtml =
  typeof document !== 'undefined' &&
  (document as Document & { documentMode?: number }).documentMode === 11

function installEventConstructor() {
  try {
    new window.Event('guard-event-constructor-probe')
    return
  } catch {
    // MSHTML exposes Event, but does not allow calling it as a constructor.
  }

  const NativeEvent = window.Event
  function LegacyEvent(this: Event, type: string, options?: EventInit) {
    if (!(this instanceof LegacyEvent)) {
      throw new TypeError('Event requires new')
    }
    if (arguments.length === 0) {
      throw new TypeError('Event requires a type')
    }
    const event = document.createEvent('Event')
    event.initEvent(String(type), !!options?.bubbles, !!options?.cancelable)
    return event
  }

  LegacyEvent.prototype =
    NativeEvent?.prototype ||
    Object.getPrototypeOf(document.createEvent('Event'))
  const constants = [
    'NONE',
    'CAPTURING_PHASE',
    'AT_TARGET',
    'BUBBLING_PHASE'
  ] as const
  constants.forEach((name, index) => {
    Object.defineProperty(LegacyEvent, name, {
      value:
        typeof NativeEvent?.[name] === 'number' ? NativeEvent[name] : index,
      enumerable: true
    })
  })
  // input-otp constructs input and selectionchange events in its effects.
  window.Event = LegacyEvent as unknown as typeof Event
}

if (isLegacyMshtml) {
  installEventConstructor()
}
