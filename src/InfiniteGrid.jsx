import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { LoadingIndicator } from '@/components/application/loading-indicator/loading-indicator'

const images = import.meta.glob('./public/toWEBP/*.webp', { eager: true, import: 'default' })
const IMAGE_URLS = Object.values(images)

const CELL_SIZE = 280 
const GAP = 25
const TOTAL_CELL = CELL_SIZE + GAP
const SPRING_CONFIG = { damping: 40, stiffness: 200, mass: 0.5 }
const SCALE_SPRING = { damping: 25, stiffness: 300, mass: 0.2 }

const mod = (n, m) => ((n % m) + m) % m

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
  
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING_CONFIG)
  const y = useSpring(rawY, SPRING_CONFIG)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const shuffledImages = useMemo(() => shuffleArray(IMAGE_URLS), [])

  useEffect(() => {
    let count = 0
    const preload = async () => {
      const promises = shuffledImages.map((url) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.loading = 'eager'
          
          img.onload = async () => {
            try {
              await img.decode()
              count++
              setLoadedCount(count)
              resolve(img)
            } catch {
              count++
              setLoadedCount(count)
              resolve(null)
            }
          }
          
          img.onerror = () => {
            count++
            setLoadedCount(count)
            resolve(null)
          }
          
          img.src = url
        })
      })
      
      await Promise.all(promises)
      setTimeout(() => setIsReady(true), 100)
    }
    preload()
  }, [shuffledImages])

  useEffect(() => {
    const handleResize = () => setContainerSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const gridConfig = useMemo(() => {
    const cols = Math.ceil(containerSize.width / TOTAL_CELL) + 4
    const rows = Math.ceil(containerSize.height / TOTAL_CELL) + 4
    const totalCells = cols * rows
    const items = []
    
    const imagePool = []
    const repetitions = Math.ceil(totalCells / shuffledImages.length)
    for (let i = 0; i < repetitions; i++) {
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

  const onPanStart = useCallback(() => setIsDragging(true), [])
  const onPan = useCallback((_, info) => {
    rawX.set(rawX.get() + info.delta.x)
    rawY.set(rawY.get() + info.delta.y)
  }, [rawX, rawY])
  const onPanEnd = useCallback(() => setIsDragging(false), [])

  return (
    <div 
      onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY) }}
      className={`w-full h-screen overflow-hidden relative touch-none select-none transition-colors duration-500 ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}
    >
      <motion.div 
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        className="absolute inset-0 z-0"
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: isReady ? 1 : 0,
          pointerEvents: isReady ? 'auto' : 'none'
        }}
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
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {!isReady && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-500 ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}
          >
            <div className="[&_.stroke-fg-brand-primary]:!stroke-neutral-500 [&_.text-bg-tertiary]:!text-neutral-300 dark:[&_.text-bg-tertiary]:!text-neutral-700">
              <LoadingIndicator type="line-simple" size="md" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const GridItem = memo(({ item, x, y, mouseX, mouseY, gridWidth, gridHeight }) => {
  const tx = useTransform(x, (v) => mod((item.relX * TOTAL_CELL) + v + TOTAL_CELL, gridWidth) - TOTAL_CELL)
  const ty = useTransform(y, (v) => mod((item.relY * TOTAL_CELL) + v + TOTAL_CELL, gridHeight) - TOTAL_CELL)

  const rawScale = useTransform([tx, ty, mouseX, mouseY], ([latestX, latestY, mx, my]) => {
    const centerX = latestX + CELL_SIZE / 2
    const centerY = latestY + CELL_SIZE / 2
    const distanceSq = (mx - centerX) ** 2 + (my - centerY) ** 2
    
    if (distanceSq > 122500) return 1
    
    const distance = Math.sqrt(distanceSq)
    return 1 + (1 - distance / 350) * 0.12
  })
  
  const scale = useSpring(rawScale, SCALE_SPRING)

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
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={item.imgUrl}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
          decoding="sync"
          draggable={false}
        />
      </div>
    </motion.div>
  )
}, (prevProps, nextProps) => 
  prevProps.item.id === nextProps.item.id
)

export default InfiniteGrid
