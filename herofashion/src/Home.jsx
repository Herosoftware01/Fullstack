import { useState } from 'react';
import './App.css';
import 'flowbite';
import logo from './assets/images/logo_hero.png';
import DataTable11 from './datatable11'
import { Link } from "react-router-dom";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <nav className="bg-[#c8d4e3] border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="https://herofashion.com/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} className="h-8" alt="Hero Fashion Logo" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 17 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          {/* Navigation Links */}
          <div
            className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}
            id="navbar-default"
          >
            <ul className="bg-[#c8d4e3!important] font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              
              

                <li>
                  <Link
                    to="/"
                    className="block py-2 px-3 text-green-500 rounded-sm cursor-pointer transition-colors duration-200 
                              hover:text-blue-700 hover:bg-gray-100 
                              md:hover:bg-transparent md:p-0 
                              dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                  >
                    Server 10
                  </Link>
                </li>

              {/* Other links with default green hover */}
              <Link
                  to="/datatable11"
                  className="block py-2 px-3 text-green-500 rounded-sm cursor-pointer transition-colors duration-200 
                            hover:text-blue-700 hover:bg-gray-100 
                            md:hover:bg-transparent md:p-0 
                            dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                >
                  Server 11
                </Link>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-green-500 rounded-sm cursor-pointer transition-colors duration-200 
                             hover:text-blue-700 hover:bg-gray-100 
                             md:hover:bg-transparent md:p-0 
                             dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-green-500 rounded-sm cursor-pointer transition-colors duration-200 
                             hover:text-blue-700 hover:bg-gray-100 
                             md:hover:bg-transparent md:p-0 
                             dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-green-500 rounded-sm cursor-pointer transition-colors duration-200 
                             hover:text-blue-700 hover:bg-gray-100 
                             md:hover:bg-transparent md:p-0 
                             dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

    </>
  );
}

export default App;
