import type { ReactNode } from "react"

import { createContext, useContext, useEffect, useRef, useState } from "react"

// Implements a behavior similar to :focus-visible for browsers that are not
// supporting it yet.
//
// It follows the Chrome implementation, checking for a pointer device to be
// active rather than the presence of a keyboard.
//
// Resources:
//  - https://caniuse.com/#search=%3Afocus-visible
//  - https://github.com/WICG/focus-visible/issues/88#issuecomment-363227219
//  - https://chromium-review.googlesource.com/c/chromium/src/+/897002<Paste>

const FocusVisibleContext = createContext<boolean>(false)

type FocusVisibleProps = {
  children: ReactNode
}

export function FocusVisible({ children }: FocusVisibleProps) {
  const element = useRef<HTMLSpanElement>(null)
  const pointerActive = useRef(false)
  const [focusVisible, setFocusVisible] = useState(false)
  const [hasRendered, setHasRendered] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const onPointerEvent = () => {
      pointerActive.current = true

      timer = setTimeout(
        () => {
          // It doesn’t seem to be specified in HTML5, but pointer-related events
          // happen before the focus-related events on every modern browser. It
          // means that between the moment where onPointerEvent gets called and
          // the this setTimeout() callback gets executed, the onFocusIn() function
          // (see below) might be executed with pointerActive.current being true.
          pointerActive.current = false
        },
        // This delay is needed because the focusin event seems to be triggered
        // asynchronously, at least on Firefox.
        100,
      )

      setFocusVisible(false)
    }

    const onFocusIn = () => {
      setFocusVisible(!pointerActive.current)
    }

    setHasRendered(true)

    const document = element.current?.ownerDocument

    if (document) {
      document.body.addEventListener("focusin", onFocusIn)
      document.addEventListener("mousedown", onPointerEvent)
      document.addEventListener("mouseup", onPointerEvent)
      document.addEventListener("touchstart", onPointerEvent)
      document.addEventListener("touchend", onPointerEvent)
    }

    return () => {
      clearTimeout(timer)

      if (document) {
        document.body.removeEventListener("focusin", onFocusIn)
        document.removeEventListener("mousedown", onPointerEvent)
        document.removeEventListener("mouseup", onPointerEvent)
        document.removeEventListener("touchstart", onPointerEvent)
        document.removeEventListener("touchend", onPointerEvent)
      }
    }
  }, [])

  return (
    <FocusVisibleContext.Provider value={focusVisible}>
      {children}
      {!hasRendered && <span ref={element} />}
    </FocusVisibleContext.Provider>
  )
}

export function useFocusVisible(): boolean {
  return useContext(FocusVisibleContext)
}
