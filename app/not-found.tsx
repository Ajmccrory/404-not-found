'use client'

import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

// Helper function to generate random positions
const generateRandomPortals = (count: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (200 - 100) + 100,
    rotation: Math.random() * 360,
  }))
}

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [portals] = useState(() => generateRandomPortals(8)) // Generate 8 random portals
  const mainPortalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const bgPortalsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    // Initial animations
    gsap.from(contentRef.current?.children || [], {
      duration: 1,
      y: 100,
      opacity: 0,
      stagger: 0.2,
      ease: "power3.out"
    })

    // Animate background portals
    bgPortalsRef.current.forEach((portal) => {
      gsap.to(portal, {
        rotation: "+=360",
        duration: gsap.utils.random(8, 15),
        repeat: -1,
        ease: "none"
      })

      // Random floating animation
      gsap.to(portal, {
        y: gsap.utils.random(-30, 30),
        x: gsap.utils.random(-30, 30),
        duration: gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    })
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Smooth portal following
      if (mainPortalRef.current) {
        gsap.to(mainPortalRef.current, {
          x: e.clientX - 150,
          y: e.clientY - 150,
          duration: 0.5,
          ease: "power2.out"
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const explodePortals = () => {
    // Explode animation for background portals
    bgPortalsRef.current.forEach((portal) => {
      // Random direction for each portal
      const randomAngle = Math.random() * Math.PI * 2
      const distance = 500 + Math.random() * 500 // Random distance between 500-1000px
      
      gsap.to(portal, {
        x: Math.cos(randomAngle) * distance,
        y: Math.sin(randomAngle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          // Reset portal position after explosion
          gsap.set(portal, {
            x: 0,
            y: 0,
            opacity: 0.7,
            scale: 1,
          })
          // Fade portal back in with new random position
          gsap.to(portal, {
            opacity: 0.7,
            duration: 0.5,
            delay: 0.3,
          })
        }
      })
    })

    // Explosion effect for main portal
    if (mainPortalRef.current) {
      gsap.to(mainPortalRef.current, {
        scale: 2,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(mainPortalRef.current, {
            scale: 1,
            opacity: 1,
          })
        }
      })
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the main click handler
    explodePortals()
    
    // Navigate after explosion animation
    setTimeout(() => {
      window.location.href = '/'
    }, 800)
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#000000] overflow-hidden relative"
      onClick={handleButtonClick}
    >
      {/* Background Portals */}
      {portals.map((portal, index) => (
        <div
          key={index}
          ref={(el: HTMLDivElement | null) => {
            if (el) bgPortalsRef.current[index] = el
          }}
          className="absolute portal-ring-bg"
          style={{
            left: `${portal.x}%`,
            top: `${portal.y}%`,
            width: `${portal.size}px`,
            height: `${portal.size}px`,
            transform: `rotate(${portal.rotation}deg)`,
          }}
        />
      ))}

      {/* Mouse Following Portal */}
      <div 
        ref={mainPortalRef}
        className="absolute w-[300px] h-[300px] z-20"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          pointerEvents: 'none',
        }}
      >
        <div className="portal-ring w-full h-full" />
        <div className="absolute inset-0 bg-[#1a1a1a] rounded-full scale-[0.85]" />
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(97,255,231,0.6) 0%, rgba(37,206,197,0.3) 50%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-9xl rick-font text-[#61ffe7] mb-4 tracking-tighter">
          404
        </h1>
        
        <div className="text-center">
          <h2 className="text-4xl rick-font text-[#25cec5] mb-4">
            Wubba Lubba Dub Dub!
          </h2>
          <p className="text-xl text-[#61ffe7] mb-12 font-medium tracking-wide">
            Looks like we slipped into the wrong dimension, Morty!
          </p>
        </div>

        <button
          onClick={handleButtonClick}
          className="relative group overflow-hidden px-8 py-4 bg-[#25cec5] text-black rounded-full 
                   rick-font text-lg tracking-wider uppercase
                   transform transition-all duration-300
                   shadow-[0_0_15px_rgba(97,255,231,0.5)]
                   hover:shadow-[0_0_25px_rgba(97,255,231,0.7)]
                   hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">
            Return to Home Dimension
          </span>
          <div className="absolute inset-0 bg-[#61ffe7] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </button>
      </div>
    </div>
  )
} 