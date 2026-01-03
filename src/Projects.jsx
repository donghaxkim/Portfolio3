import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const Projects = ({ theme }) => {
  const projects = [
    {
      name: "3D Vector Renderer",
      techStack: ["Python", "Pygame", "NumPy"],
      description: "A custom 3D engine built from scratch. It handles vector transformations, 3D-to-2D projection, and wireframe rendering of complex geometric shapes without external graphics libraries.",
      github: "https://github.com/donghaxkim/3DRenderer"
    },
    {
      name: "Personal Website v2",
      techStack: ["Next.js", "React", "Vite", "Tailwind CSS", "Framer Motion"],
      description: "A refined iteration of my digital presence, utilizing Next.js for server-side rendering and optimized performance. Features advanced motion layouts.",
      github: "https://github.com/donghaxkim/personalwebsitev2"
    },
    {
      name: "Bayesian Blackwell BlackJack Engine",
      techStack: ["NumPy", "SciPy", "Typing", "Functools", "Pathlib", "Dataclasses"],
      description: "A high-performance simulation engine utilizing Bayesian inference and Blackwell games theory to optimize Blackjack strategies. Built with a focus on functional programming patterns and rigorous scientific computing.",
      github: "https://github.com/donghaxkim/Bayesian-BlackJack-Engine"
    },
    {
      name: "Personal Website v1",
      techStack: ["React", "Tailwind CSS", "Framer Motion", "Vite"],
      description: "A minimalistic personal portfolio with interactive fluid animations and a custom Spotify player.",
      github: "https://github.com/yourusername/portfolio-v1"
    },
    {
      name: "Langton's Ant Sim",
      techStack: ["Python", "NumPy", "Matplotlib"],
      description: "A simulation of the two-dimensional universal Turing machine visualizing emergent behavior and cellular automata logic.",
      github: "https://github.com/yourusername/langtons-ant"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto h-full overflow-y-auto px-4"
      style={{ paddingTop: '6rem', paddingBottom: '4rem' }}
    >
      <h1 
        className="text-6xl md:text-6xl font-semibold tracking-tighter text-left mb-[0.88rem]" 
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        Projects
      </h1>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-12 md:space-y-16"
        style={{ fontFamily: "'Karla', sans-serif", marginTop: '0.88rem' }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className={`${
              theme === 'dark' ? 'text-white/80' : 'text-black/80'
            }`}
          >
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <h2 className="text-xl md:text-2xl font-medium" style={{ fontFamily: "'Karla', sans-serif" }}>
                {project.name}
              </h2>
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity"
              >
                <ExternalLink size={18} strokeWidth={1.5} />
              </a>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className={`px-3 py-1 text-xs md:text-sm rounded-full font-light ${
                    theme === 'dark' 
                      ? 'bg-white/10 text-white/70' 
                      : 'bg-black/5 text-black/70'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <p className="text-sm md:text-base font-light leading-normal">
              {project.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Projects