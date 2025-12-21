import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue } from 'framer-motion'

// Filter for displayable image formats
const images = [
  '1164962732570788597.jpg',
  'IMG_0486.JPG',
  'IMG_1007.JPG',
  'IMG_1454.JPG',
  'IMG_3177.JPG',
  'IMG_3195.JPG',
  'IMG_3356.JPG',
  'IMG_3476.JPG',
  'IMG_4263.JPG',
  'IMG_4951.JPG',
  'IMG_5224.JPG',
  'IMG_5422.JPG',
  'IMG_5475.JPG',
  'IMG_5649.JPG',
  'IMG_6065.JPG',
  'IMG_6111.JPG',
  'IMG_6168.JPG',
  'IMG_6414.JPG',
  'IMG_6881.JPG',
  'IMG_6972.JPG',
  'IMG_7194.JPG',
  'IMG_7496.JPG',
  'IMG_7795.JPG',
  'IMG_8234.JPG',
  'IMG_8416.JPG',
  'IMG_8949.JPG',
  'IMG_9231.JPG',
]

const InfiniteGrid = ({ theme }) => {
  const containerRef = useRef(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  
  // Motion values for position
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Grid configuration
  const CELL_SIZE = 280 // Size of each grid cell
  const GAP = 20 // Gap between cells
  
  // Calculate grid dimensions based on screen size to fill viewport
  const totalCellSize = CELL_SIZE + GAP
  const GRID_COLS = Math.ceil(containerSize.width / totalCellSize) + 4 // Extra cells for seamless wrapping
  const GRID_ROWS = Math.ceil(containerSize.height / totalCellSize) + 4
  
  // Physics constants
  const FRICTION = 0.92
  const MIN_VELOCITY = 0.5
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  
  // Modulo function that works correctly with negative numbers
  const mod = (n, m) => {
    return ((n % m) + m) % m
  }
  
  // Apply momentum physics when drag ends
  const handleDragEnd = (event, info) => {
    const vx = info.velocity.x
    const vy = info.velocity.y
    
    // If velocity is significant, apply momentum
    if (Math.abs(vx) > MIN_VELOCITY || Math.abs(vy) > MIN_VELOCITY) {
      let currentVX = vx
      let currentVY = vy
      let currentX = x.get()
      let currentY = y.get()
      
      const applyMomentum = () => {
        // Apply friction
        currentVX *= FRICTION
        currentVY *= FRICTION
        
        // Update position
        currentX += currentVX * 0.016 // Assuming 60fps
        currentY += currentVY * 0.016
        
        x.set(currentX)
        y.set(currentY)
        
        // Continue if velocity is still significant
        if (Math.abs(currentVX) > MIN_VELOCITY || Math.abs(currentVY) > MIN_VELOCITY) {
          requestAnimationFrame(applyMomentum)
        }
      }
      
      requestAnimationFrame(applyMomentum)
    }
  }
  
  
  // Create grid items with wrapping - fill entire screen
  const createGridItems = () => {
    const items = []
    let imageIndex = 0
    
    // Calculate starting positions to center the grid
    const startCol = -Math.floor(GRID_COLS / 2)
    const startRow = -Math.floor(GRID_ROWS / 2)
    
    for (let row = startRow; row < startRow + GRID_ROWS; row++) {
      for (let col = startCol; col < startCol + GRID_COLS; col++) {
        const image = images[imageIndex % images.length]
        items.push({
          id: `${col}-${row}`,
          col,
          row,
          image
        })
        imageIndex++
      }
    }
    
    return items
  }
  
  const gridItems = createGridItems()
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-screen overflow-hidden relative"
      style={{ 
        cursor: 'grab',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff'
      }}
    >
      <motion.div
        drag
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onDragEnd={handleDragEnd}
        style={{ 
          x, 
          y,
          cursor: 'grab'
        }}
        whileTap={{ cursor: 'grabbing' }}
        className="absolute inset-0"
      >
        {gridItems.map((item) => (
          <GridItem
            key={item.id}
            item={item}
            x={x}
            y={y}
            cellSize={CELL_SIZE}
            gap={GAP}
            containerSize={containerSize}
            gridCols={GRID_COLS}
            gridRows={GRID_ROWS}
            theme={theme}
          />
        ))}
      </motion.div>
      
      {/* Instructions overlay */}
      <div className={`absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none z-10 px-6 py-3 rounded-full backdrop-blur-sm ${
        theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
      }`}>
        <p className="text-sm font-light" style={{ fontFamily: "'Karla', sans-serif" }}>
          Drag anywhere to explore the infinite grid
        </p>
      </div>
    </div>
  )
}

// Individual grid item component with wrapping logic
const GridItem = ({ item, x, y, cellSize, gap, containerSize, gridCols, gridRows, theme }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const mod = (n, m) => ((n % m) + m) % m
  
  useEffect(() => {
    const unsubscribeX = x.on('change', (latest) => {
      updatePosition(latest, y.get())
    })
    
    const unsubscribeY = y.on('change', (latest) => {
      updatePosition(x.get(), latest)
    })
    
    // Initial position
    updatePosition(x.get(), y.get())
    
    return () => {
      unsubscribeX()
      unsubscribeY()
    }
  }, [containerSize])
  
  const updatePosition = (offsetX, offsetY) => {
    const totalWidth = cellSize + gap
    const totalHeight = cellSize + gap
    const gridWidth = totalWidth * gridCols
    const gridHeight = totalHeight * gridRows
    
    // Base position
    let baseX = item.col * totalWidth
    let baseY = item.row * totalHeight
    
    // Apply offset with wrapping
    let finalX = baseX + mod(offsetX, gridWidth)
    let finalY = baseY + mod(offsetY, gridHeight)
    
    // Wrap around to create seamless infinite effect
    const screenCenterX = containerSize.width / 2
    const screenCenterY = containerSize.height / 2
    
    // Adjust so grid wraps around screen center
    finalX = mod(finalX + screenCenterX + gridWidth / 2, gridWidth) - gridWidth / 2 + screenCenterX
    finalY = mod(finalY + screenCenterY + gridHeight / 2, gridHeight) - gridHeight / 2 + screenCenterY
    
    setPosition({ x: finalX, y: finalY })
  }
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: cellSize,
        height: cellSize,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform'
      }}
      className="pointer-events-none"
    >
      <div 
        className={`w-full h-full rounded-lg overflow-hidden shadow-lg ${
          theme === 'dark' ? 'ring-1 ring-white/10' : 'ring-1 ring-black/10'
        }`}
      >
        <img
          src={`/src/public/Website/${item.image}`}
          alt=""
          className="w-full h-full object-cover"
          draggable="false"
        />
      </div>
    </motion.div>
  )
}

export default InfiniteGrid

