import { motion } from 'framer-motion'

const Projects = ({ theme }) => {
  const projects = [
    {
      name: "Portfolio Website",
      techStack: ["React", "Tailwind CSS", "Framer Motion", "Vite"],
      description: "A minimalistic personal portfolio with interactive fluid animations and a custom Spotify player. Built with modern web technologies for a smooth, responsive experience."
    },
    {
      name: "Math Solver Application",
      techStack: ["Python", "NumPy", "Flask"],
      description: "A computational mathematics tool for solving complex equations and visualizing mathematical concepts. Features include matrix operations, calculus computations, and interactive graphs."
    },
    {
      name: "Task Management System",
      techStack: ["React", "Node.js", "MongoDB", "Express"],
      description: "A full-stack web application for managing team projects and individual tasks. Includes real-time updates, collaborative features, and progress tracking."
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
      style={{ marginTop: '-16rem' }}
    >
      <h1 
        className="text-6xl md:text-6xl font-semibold tracking-tighter text-left" 
        style={{ fontFamily: "'Gowun Batang', serif", marginBottom: '0.88rem' }}
      >
        Projects
      </h1>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-12 md:space-y-16"
        style={{ fontFamily: "'Karla', sans-serif" }}
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
            <h2 className="text-xl md:text-2xl font-medium mb-3 md:mb-4" style={{ fontFamily: "'Karla', sans-serif" }}>
              {project.name}
            </h2>
            
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
            
            <p className="text-sm md:text-base font-light leading-loose">
              {project.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Projects
