import { useEffect, useState } from "react"

const getIsMobile = () => window.innerWidth <= 768

const useDeviceCheck = () => {
  const [isMobileUtils, setIsMobileUtils] = useState(getIsMobile())

  const handleResize = () => {
    setIsMobileUtils(getIsMobile())
  }

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return { isMobileUtils, isDesktopUtils: !isMobileUtils }
}

export default useDeviceCheck
