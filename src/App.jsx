import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MdEmail } from 'react-icons/md'
import { FaLinkedin, FaGithub, FaXTwitter } from 'react-icons/fa6'
import Navbar from './Navbar'
import SpotifyPlayer from './SpotifyPlayer'
import Projects from './Projects'
import InfiniteGrid from './InfiniteGrid'

// Home component
const Home = ({ theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h1 className="text-6xl md:text-6xl font-semibold tracking-tighter text-left -mt-8 md:-mt-12" style={{ fontFamily: "'Gowun Batang', serif", marginBottom: '0.88rem' }}>
        Dongha Kim
      </h1>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ fontFamily: "'Karla', sans-serif" }}
        className={`space-y-6 md:space-y-8 text-sm md:text-base font-light leading-loose ${
          theme === 'dark' ? 'text-white/80' : 'text-black/80'
        }`}
      >
        <p>
          Hi, I'm <strong className="font-medium">DK</strong>, a <strong className="font-medium">Mathematics</strong> student at the <strong className="font-medium">University of Waterloo</strong>. I have a strong interest in <strong className="font-medium">Growth</strong> & <strong className="font-medium">Software Engineering</strong>, and while my studies keep me immersed most of the time, I'm a firm believer that the best growth happens through connection and collaboration.
        </p>
        
        <p>
          Outside of the classroom, you can find me on the basketball court, catching up with friends, or hanging out with my cat, <strong className="font-medium">Maui</strong>. I also enjoy sharing my perspectives on random things <strong className="font-medium">@imdonghakim</strong> on both{' '}
          <a
            href="https://instagram.com/imdonghakim"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium underline ${
              theme === 'dark' ? 'text-white hover:text-white/80' : 'text-black hover:text-black/70'
            }`}
          >
            Instagram
          </a>
          {' '}and{' '}
          <a
            href="https://tiktok.com/@imdonghakim"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium underline ${
              theme === 'dark' ? 'text-white hover:text-white/80' : 'text-black hover:text-black/70'
            }`}
          >
            TikTok
          </a>
          .
        </p>
        
        <p>
          I'm always excited to meet new people, whether it's to discuss a potential project, a professional opportunity, or just to have an insightful chat. Feel free to reach out{' '}
          <a
            href="mailto:dongha.kim@uwaterloo.ca"
            className={`font-medium underline ${
              theme === 'dark' ? 'text-white hover:text-white/80' : 'text-black hover:text-black/70'
            }`}
          >
            here
          </a>
          !
        </p>
        
        {/* Social Media Icons */}
        <div className="flex gap-4 mt-14 select-none">
          <a
            href="mailto:dongha.kim@uwaterloo.ca"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-opacity ${
              theme === 'dark' ? 'text-white/60 hover:text-white/90' : 'text-black/60 hover:text-black/90'
            }`}
            draggable={false}
          >
            <MdEmail size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/dongha-kimm/"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-opacity ${
              theme === 'dark' ? 'text-white/60 hover:text-white/90' : 'text-black/60 hover:text-black/90'
            }`}
            draggable={false}
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://github.com/donghaxkim"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-opacity ${
              theme === 'dark' ? 'text-white/60 hover:text-white/90' : 'text-black/60 hover:text-black/90'
            }`}
            draggable={false}
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://x.com/imdonghakim"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-opacity ${
              theme === 'dark' ? 'text-white/60 hover:text-white/90' : 'text-black/60 hover:text-black/90'
            }`}
            draggable={false}
          >
            <FaXTwitter size={20} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Force default theme to light on first load
    setTheme('light')
    localStorage.setItem('theme', 'light')
  }, [])

  useEffect(() => {
    // Apply theme to html element for overscroll areas
    document.documentElement.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff'
    document.body.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff'
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen flex transition-colors duration-500 ${
          theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black'
        }`}
      >
        {/* Navbar */}
        <Navbar 
          theme={theme}
          toggleTheme={toggleTheme}
        />

      {/* Main Content */}
      <main className="w-full min-h-screen flex items-center justify-center px-6 md:px-8 py-6 pb-24 md:pb-32">
        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/projects" element={<Projects theme={theme} />} />
          <Route path="/grid" element={<InfiniteGrid theme={theme} />} />
        </Routes>

        {/* Spotify Player in bottom-right */}
        <div className="fixed bottom-4 right-4 z-50 max-w-[320px]">
          <SpotifyPlayer theme={theme} />
        </div>
      </main>
    </motion.div>
  )
}

export default App

