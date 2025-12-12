import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdEmail } from 'react-icons/md'
import { FaLinkedin, FaGithub, FaXTwitter } from 'react-icons/fa6'
import Navbar from './Navbar'

function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

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
        <AnimatePresence mode="wait">
          {true && (
            <motion.div
              id="home"
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl mx-auto"
            >
              <h1 className="text-6xl md:text-7xl font-semibold mb-0 -mt-8 md:-mt-12 tracking-tighter text-left" style={{ fontFamily: "'Dongle', sans-serif" }}>
                  Dongha Kim
              </h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ marginTop: '-1.25rem' }}
                className={`space-y-6 md:space-y-8 text-sm md:text-base font-light leading-loose ${
                  theme === 'dark' ? 'text-white/80' : 'text-black/80'
                }`}
              >
                <p>
                  Hi, I'm <strong className="font-medium">DK</strong>, a <strong className="font-medium">Mathematics</strong> student at the <strong className="font-medium">University of Waterloo</strong>. I have a strong interest in Leadership and Software Engineering, and while my studies keep me immersed most of the time, I'm a firm believer that the best growth happens through connection and collaboration.
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
                    href="mailto:your.email@example.com"
                    className={`font-medium underline ${
                      theme === 'dark' ? 'text-white hover:text-white/80' : 'text-black hover:text-black/70'
                    }`}
                  >
                    here
                  </a>
                  !
                </p>
                
                {/* Social Media Icons */}
                <div className="flex gap-4 mt-14">
                  <a
                    href="mailto:dongha.kim@uwaterloo.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-opacity ${
                      theme === 'dark' ? 'text-white/60 hover:text-white/90' : 'text-black/60 hover:text-black/90'
                    }`}
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
                  >
                    <FaXTwitter size={20} />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}

          {false && (
            <motion.div
              id="projects"
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-light mb-6 md:mb-8 tracking-tight" style={{ fontFamily: "'Work Sans', sans-serif" }}>
                Projects
              </h1>
              
              <div className="space-y-4 md:space-y-6">
                {['Project One', 'Project Two', 'Project Three'].map((project, index) => (
                  <motion.a
                    key={project}
                    href="#"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className={`block text-base md:text-lg font-light ${
                      darkMode ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'
                    }`}
                  >
                    {project}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}

          {false && (
            <motion.div
              id="album"
              key="album"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-light mb-6 md:mb-8 tracking-tight" style={{ fontFamily: "'Work Sans', sans-serif" }}>
                Album
              </h1>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {[1, 2, 3, 4, 5, 6].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className={`aspect-square rounded-xl overflow-hidden ${
                      darkMode ? 'bg-white/5' : 'bg-black/5'
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className={`text-xs md:text-sm font-light ${
                        darkMode ? 'text-white/30' : 'text-black/30'
                      }`}>
                        Photo {item}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`mt-6 md:mt-8 text-xs md:text-sm font-light ${
                  darkMode ? 'text-white/50' : 'text-black/50'
                }`}
              >
                Add your photos to showcase your life, hobbies, and moments!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  )
}

export default App

