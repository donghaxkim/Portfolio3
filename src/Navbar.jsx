import { BiHomeAlt } from 'react-icons/bi'
import { FaCubes } from 'react-icons/fa'
import { IoMdPhotos } from 'react-icons/io'
import { WiMoonAltThirdQuarter, WiDaySunny } from 'react-icons/wi'
import { Link as RouterLink } from 'react-router-dom'

const Navbar = ({ theme, toggleTheme }) => {
  const glassClass = theme === 'dark' ? 'glass-dark' : 'glass-light'
  const iconColor = theme === 'dark' ? 'text-white/60' : 'text-gray-800/70'
  const iconHover = theme === 'dark' ? 'hover:text-gray-200 hover:scale-110' : 'hover:text-gray-900 hover:scale-110'

  return (
    <>
      {/* TOP NAVBAR */}
      <nav
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className={`h-[72px] rounded-full w-[520px] px-8 flex items-center justify-between text-2xl ${glassClass} ${iconColor} backdrop-blur-3xl`}>
            <RouterLink
              to="/"
              className={`cursor-pointer w-[56px] h-[56px] flex items-center justify-center ${iconHover} transition-all duration-200`}
              title="home"
            >
              <BiHomeAlt />
            </RouterLink>

            <RouterLink
              to="/projects"
              className={`cursor-pointer w-[56px] h-[56px] flex items-center justify-center ${iconHover} transition-all duration-200`}
              title="projects"
            >
              <FaCubes />
            </RouterLink>

            <RouterLink
              to="/grid"
              className={`cursor-pointer w-[56px] h-[56px] flex items-center justify-center ${iconHover} transition-all duration-200`}
              title="gallery"
            >
              <IoMdPhotos />
            </RouterLink>

            <div
              className={`cursor-pointer w-[56px] h-[56px] flex items-center justify-center ${iconHover} transition-all duration-200`}
              onClick={toggleTheme}
              title={theme === 'dark' ? 'toggle light mode' : 'toggle dark mode'}
            >
              {theme === 'dark' ? <WiDaySunny /> : <WiMoonAltThirdQuarter />}
            </div>
        </div>
      </nav>

    </>
  )
}

export default Navbar

