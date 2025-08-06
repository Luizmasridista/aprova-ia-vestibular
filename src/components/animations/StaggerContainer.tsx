import React from 'react'
import { motion } from 'framer-motion'

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
  duration?: number
}

// Variantes para diferentes direções de animação
const getStaggerVariants = (direction: string) => {
  const baseDistance = 30
  
  switch (direction) {
    case 'up':
      return {
        hidden: { opacity: 0, y: baseDistance },
        visible: { opacity: 1, y: 0 }
      }
    case 'down':
      return {
        hidden: { opacity: 0, y: -baseDistance },
        visible: { opacity: 1, y: 0 }
      }
    case 'left':
      return {
        hidden: { opacity: 0, x: baseDistance },
        visible: { opacity: 1, x: 0 }
      }
    case 'right':
      return {
        hidden: { opacity: 0, x: -baseDistance },
        visible: { opacity: 1, x: 0 }
      }
    case 'scale':
      return {
        hidden: { opacity: 0, scale: 0.8, rotateX: -15 },
        visible: { opacity: 1, scale: 1, rotateX: 0 }
      }
    default:
      return {
        hidden: { opacity: 0, y: baseDistance },
        visible: { opacity: 1, y: 0 }
      }
  }
}

export function StaggerContainer({ 
  children, 
  className = "", 
  staggerDelay = 0.1,
  initialDelay = 0,
  direction = 'up',
  duration = 0.5
}: StaggerContainerProps) {
  const variants = getStaggerVariants(direction)
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay
      }
    }
  }

  const itemVariants = {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
        duration
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02, 
            transition: { duration: 0.2 } 
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Componente para itens individuais com animação personalizada
interface StaggerItemProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
  className?: string
}

export function StaggerItem({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = ""
}: StaggerItemProps) {
  const variants = getStaggerVariants(direction)
  
  return (
    <motion.div
      initial={variants.hidden}
      animate={variants.visible}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay
      }}
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Hook para criar animações stagger customizadas
export function useCustomStaggerAnimation(
  itemCount: number, 
  staggerDelay: number = 0.1,
  initialDelay: number = 0
) {
  const getItemAnimation = (index: number) => ({
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: initialDelay + (index * staggerDelay)
      }
    },
    whileHover: {
      scale: 1.03,
      y: -3,
      transition: { duration: 0.2 }
    }
  })

  return { getItemAnimation }
}

// Componente para seções completas com título e conteúdo
interface StaggerSectionProps {
  title: string
  children: React.ReactNode
  className?: string
  titleDelay?: number
  contentDelay?: number
  staggerDelay?: number
}

export function StaggerSection({
  title,
  children,
  className = "",
  titleDelay = 0,
  contentDelay = 0.2,
  staggerDelay = 0.08
}: StaggerSectionProps) {
  return (
    <div className={className}>
      {/* Título animado */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          delay: titleDelay
        }}
        className="text-xl font-semibold mb-4 text-foreground"
      >
        {title}
      </motion.h2>

      {/* Conteúdo com stagger */}
      <StaggerContainer
        staggerDelay={staggerDelay}
        initialDelay={contentDelay}
        direction="up"
      >
        {children}
      </StaggerContainer>
    </div>
  )
}
