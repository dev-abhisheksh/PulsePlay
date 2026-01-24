import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const GenreFilter = ({ isFilterGenreToggle, selectedGenre, setSelectedGenre }) => {
    const genres = ["Phonk", "R&B", "Rock", "Pop", "Classical"]
    const scrollContainerRef = useRef(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(false)

    const handleGenreClick = (genre) => {
        setSelectedGenre(prev => prev === genre ? null : genre)
    }

    const checkScrollPosition = () => {
        const container = scrollContainerRef.current
        if (container) {
            setShowLeftArrow(container.scrollLeft > 5)
            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 5
            )
        }
    }

    const scroll = (direction) => {
        const container = scrollContainerRef.current
        if (container) {
            const scrollAmount = 250
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    useEffect(() => {
        const timer = setTimeout(checkScrollPosition, 100)
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener('scroll', checkScrollPosition)
            window.addEventListener('resize', checkScrollPosition)
            return () => {
                container.removeEventListener('scroll', checkScrollPosition)
                window.removeEventListener('resize', checkScrollPosition)
                clearTimeout(timer)
            }
        }
    }, [isFilterGenreToggle])

    return (
        <div
            className={`
                bg-[#1A1824] relative
                transition-all duration-500 ease-in-out
                ${isFilterGenreToggle ? "h-20 opacity-100" : "h-0 opacity-0 overflow-hidden"}
            `}
        >
            <div className="h-full flex items-center px-4 relative">
                {/* Left Gradient Overlay */}
                {showLeftArrow && (
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#1A1824] to-transparent z-10 pointer-events-none" />
                )}

                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-1 z-20 bg-[#2E2A3A] hover:bg-[#3E3A4A] rounded-full p-2 shadow-lg transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                )}

                {/* Scrollable Genre Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex items-center gap-3 overflow-x-auto w-full px-1 py-4 genre-scroll-container"
                    style={{ 
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            onClick={() => handleGenreClick(genre)}
                            className={`
                                px-6 py-2 rounded-full font-semibold text-sm whitespace-nowrap flex-shrink-0
                                transition-all duration-200 transform hover:scale-105
                                ${selectedGenre === genre 
                                    ? "bg-green-500 text-black shadow-lg shadow-green-500/50" 
                                    : "bg-[#2E2A3A] text-white hover:bg-[#3E3A4A]"
                                }
                            `}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                {/* Right Gradient Overlay */}
                {showRightArrow && (
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#1A1824] to-transparent z-10 pointer-events-none" />
                )}

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-1 z-20 bg-[#2E2A3A] hover:bg-[#3E3A4A] rounded-full p-2 shadow-lg transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                )}
            </div>

            <style>{`
                .genre-scroll-container::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}

export default GenreFilter