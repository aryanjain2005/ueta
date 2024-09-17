import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/Logo.jpg'

const Navbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false)
      }
    }

    // Add event listener when the dropdown is shown
    if (showMenu) {
      document.addEventListener('click', handleOutsideClick)
    } else {
      // Remove event listener when the dropdown is hidden
      document.removeEventListener('click', handleOutsideClick)
    }

    // Cleanup function to remove event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [showMenu])

  const toggleMenu = (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    setShowMenu((prevState) => !prevState)
  }

  return (
    <>
      <nav className="bg-[#414359] w-full md:sticky top-0 z-20">
        <div className="w-full mx-auto">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/">
                  <img className="h-14 w-auto ml-2" src={Logo} alt="Movies" />
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                <div className="flex items-center mx-2">
                  <button
                    onClick={toggleMenu}
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
                    aria-label="Main menu"
                    aria-expanded={showMenu}
                  >
                    <svg
                      className="block h-6 w-6"
                      stroke="white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            ref={dropdownRef}
            className={`${
              showMenu
                ? 'block absolute right-0 mt-2 w-1/4 bg-gray-800 mr-2 max-sm:w-1/2 z-20 rounded-md font-monts'
                : 'hidden'
            }`}
          >
            <div className="px-2 pt-2 pb-3 z-30">
              <>
                <NavItem to="/product" toggleMenu={toggleMenu}>
                  Product
                </NavItem>
                <NavItem to="/brand" toggleMenu={toggleMenu}>
                  Brand
                </NavItem>
                <NavItem to="/dealer" toggleMenu={toggleMenu}>
                  Dealer
                </NavItem>
                <NavItem to="/distributor" toggleMenu={toggleMenu}>
                  Distributor
                </NavItem>
              </>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

interface NavItemProps {
  to?: string
  children: React.ReactNode
  toggleMenu?: () => void
  disabled?: boolean
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  children,
  toggleMenu,
  disabled = false
}) => {
  const handleClick = () => {
    if (!disabled && toggleMenu) {
      toggleMenu()
    }
  }

  if (disabled) {
    return (
      <span
        className="block px-3 py-2 rounded-md text-base font-medium text-white opacity-50 cursor-not-allowed"
        aria-disabled={disabled}
      >
        {children}
      </span>
    )
  }

  return (
    <Link
      to={to || '#'}
      onClick={handleClick}
      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
    >
      {children}
    </Link>
  )
}

export default Navbar
