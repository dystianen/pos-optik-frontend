import { useCallback, useEffect } from 'react'

declare global {
  interface Window {
    grecaptcha: any
  }
}

export function useReCaptcha() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  useEffect(() => {
    if (!siteKey) return

    // Check if script already exists
    const existingScript = document.getElementById('recaptcha-v3-script')
    if (existingScript) return

    const script = document.createElement('script')
    script.id = 'recaptcha-v3-script'
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [siteKey])

  const executeRecaptcha = useCallback(
    async (action: string): Promise<string> => {
      if (!siteKey) {
        console.warn('reCAPTCHA site key not configured. Bypassing.')
        return ''
      }

      return new Promise((resolve) => {
        const checkAndExecute = () => {
          if (typeof window !== 'undefined' && window.grecaptcha) {
            window.grecaptcha.ready(() => {
              window.grecaptcha
                .execute(siteKey, { action })
                .then((token: string) => {
                  resolve(token)
                })
                .catch((err: any) => {
                  console.error('reCAPTCHA execution error:', err)
                  resolve('')
                })
            })
          } else {
            // Script not loaded yet, retry in 100ms
            setTimeout(checkAndExecute, 100)
          }
        }
        checkAndExecute()
      })
    },
    [siteKey]
  )

  return { executeRecaptcha }
}
