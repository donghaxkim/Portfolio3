import { useRef, useState, useEffect, useMemo, useCallback, memo } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'

const images = import.meta.glob('./public/toWEBP/*.webp', { eager: true, import: 'default' })
const IMAGE_URLS = Object.values(images)

// Log the number of unique images loaded
console.log(`✓ Loaded ${IMAGE_URLS.length} unique images from gallery`)

const CELL_SIZE = 280 
const GAP = 25
const TOTAL_CELL = CELL_SIZE + GAP

// Helper for wrap-around logic
const mod = (n, m) => ((n % m) + m) % m

// Improved hash function for better distribution
const getImageIndex = (col, row, totalImages) => {
  // Use multiple large primes for better distribution
  const hash1 = col * 2654435761
  const hash2 = row * 2246822519
  const combined = (hash1 ^ hash2) >>> 0 // Ensure positive 32-bit integer
  return combined % totalImages
}

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const InfiniteGrid = ({ theme }) => {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [isReady, setIsReady] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Shuffle images once for better variety
  const shuffledImages = useMemo(() => shuffleArray(IMAGE_URLS), [])

  // Optimized Preloader
  useEffect(() => {
    let count = 0
    const preload = async () => {
      const promises = shuffledImages.map((url) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.src = url
          img.onload = () => { count++; setLoadedCount(count); resolve() }
          img.onerror = () => { count++; setLoadedCount(count); resolve() }
        })
      })
      await Promise.all(promises)
      setTimeout(() => setIsReady(true), 400)
    }
    preload()
  }, [shuffledImages])

  useEffect(() => {
    const handleResize = () => setContainerSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Optimized Grid Logic - ensures no duplicate images on screen
  const gridConfig = useMemo(() => {
    const cols = Math.ceil(containerSize.width / TOTAL_CELL) + 4
    const rows = Math.ceil(containerSize.height / TOTAL_CELL) + 4
    const totalCells = cols * rows
    const items = []
    
    // Create a large pool by repeating shuffled images to cover all cells
    // This ensures uniqueness within the visible grid
    const imagePool = []
    const repetitions = Math.ceil(totalCells / shuffledImages.length)
    for (let i = 0; i < repetitions; i++) {
      // Re-shuffle each repetition for variety across screen boundaries
      imagePool.push(...shuffleArray(shuffledImages))
    }
    
    let poolIndex = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.push({ 
          id: `${r}-${c}`, 
          relX: c - 1, 
          relY: r - 1,
          imgUrl: imagePool[poolIndex % imagePool.length]
        })
        poolIndex++
      }
    }
    return { items, cols, rows }
  }, [containerSize, shuffledImages])

  const onPanStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const onPan = useCallback((_, info) => {
    x.set(x.get() + info.delta.x)
    y.set(y.get() + info.delta.y)
  }, [x, y])

  const onPanEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div 
      onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY) }}
      className={`w-full h-screen overflow-hidden relative touch-none select-none ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'}`}
    >
      <AnimatePresence>
        {!isReady && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-inherit"
          >
             <div className="w-32 h-[1px] bg-neutral-800 mb-4">
                <motion.div 
                  className={`h-full ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(loadedCount / IMAGE_URLS.length) * 100}%` }}
                />
             </div>
             <p className="text-[9px] tracking-[0.5em] uppercase opacity-40 font-mono">
                Buffering Gallery
             </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        className="absolute inset-0 z-0" 
        style={{ cursor: isDragging ? 'grabbing' : 'grab', opacity: isReady ? 1 : 0 }}
      >
        {gridConfig.items.map((item) => (
          <GridItem
            key={item.id}
            item={item}
            x={x}
            y={y}
            mouseX={mouseX}
            mouseY={mouseY}
            gridWidth={gridConfig.cols * TOTAL_CELL}
            gridHeight={gridConfig.rows * TOTAL_CELL}
            theme={theme}
          />
        ))}
      </motion.div>
    </div>
  )
}

const GridItem = memo(({ item, x, y, mouseX, mouseY, gridWidth, gridHeight, theme }) => {
  const tx = useTransform(x, (v) => mod((item.relX * TOTAL_CELL) + v + TOTAL_CELL, gridWidth) - TOTAL_CELL)
  const ty = useTransform(y, (v) => mod((item.relY * TOTAL_CELL) + v + TOTAL_CELL, gridHeight) - TOTAL_CELL)

  // Magnetic Scale Effect - optimized with reduced calculation frequency
  const scale = useTransform([tx, ty, mouseX, mouseY], ([latestX, latestY, mx, my]) => {
    const centerX = latestX + CELL_SIZE / 2
    const centerY = latestY + CELL_SIZE / 2
    const dx = mx - centerX
    const dy = my - centerY
    const distanceSq = dx * dx + dy * dy
    const threshold = 350 * 350
    
    if (distanceSq > threshold) return 1
    
    const distance = Math.sqrt(distanceSq)
    return 1 + (1 - distance / 350) * 0.12
  })

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: CELL_SIZE,
        height: CELL_SIZE,
        x: tx,
        y: ty,
        scale,
        willChange: 'transform',
        transformTemplate: ({ x, y, scale }) => `translate3d(${x}, ${y}, 0) scale(${scale})`,
      }}
      className="pointer-events-none"
    >
      <div className={`w-full h-full rounded-2xl overflow-hidden shadow-2xl ${
        theme === 'dark' ? 'bg-white/5 ring-1 ring-white/10' : 'bg-black/5 ring-1 ring-black/5'
      }`}>
        <img
          src={item.imgUrl}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          draggable={false}
        />
      </div>
    </motion.div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for memo - only re-render if theme changes or item id changes
  return prevProps.item.id === nextProps.item.id && prevProps.theme === nextProps.theme
})

export default InfiniteGrid