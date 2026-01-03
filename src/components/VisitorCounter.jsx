import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const VisitorCounter = ({ theme }) => {
  const [visitorCount, setVisitorCount] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [showCounter, setShowCounter] = useState(false)

  // Check if admin mode is enabled via URL parameter or localStorage
  useEffect(() => {
    const isAdmin = searchParams.get('admin') === 'true' || localStorage.getItem('showVisitorCount') === 'true'
    setShowCounter(isAdmin)
  }, [searchParams])

  useEffect(() => {
    if (!showCounter) {
      setIsLoading(false)
      return
    }

    const namespace = 'dongha-kim-portfolio'
    const key = 'visitor-count'
    
    // Check if this is a new visitor (not in sessionStorage)
    const hasVisited = sessionStorage.getItem('hasVisited')
    
    const fetchCount = async () => {
      try {
        // Get current count
        const getResponse = await fetch(`https://api.countapi.xyz/get/${namespace}/${key}`)
        const getData = await getResponse.json()
        
        if (getData.value !== undefined) {
          setVisitorCount(getData.value)
        }
        
        // Increment count if this is a new visitor in this session
        if (!hasVisited) {
          const hitResponse = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
          const hitData = await hitResponse.json()
          
          if (hitData.value !== undefined) {
            setVisitorCount(hitData.value)
            sessionStorage.setItem('hasVisited', 'true')
          }
        }
      } catch (error) {
        console.error('Error fetching visitor count:', error)
        // Fallback to localStorage if API fails
        const localCount = parseInt(localStorage.getItem('visitorCount') || '0') + 1
        localStorage.setItem('visitorCount', localCount.toString())
        setVisitorCount(localCount)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCount()
  }, [showCounter])

  // Don't render anything if admin mode is not enabled
  if (!showCounter || isLoading) {
    return null
  }

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 px-3 py-2 rounded-md text-xs font-light ${
        theme === 'dark' 
          ? 'bg-white/10 text-white/60 border border-white/20' 
          : 'bg-black/5 text-black/60 border border-black/10'
      }`}
      style={{ fontFamily: "'Karla', sans-serif" }}
    >
      {visitorCount !== null && (
        <span>
          {visitorCount.toLocaleString()} {visitorCount === 1 ? 'visitor' : 'visitors'}
        </span>
      )}
    </div>
  )
}

export default VisitorCounter

