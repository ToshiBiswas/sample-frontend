import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "./Header.scss";


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState('');
  const [logoSrc, setLogoSrc] = useState(
    window.innerWidth < 768
      ? "../../../public/InStock-Logo_2x.png"
      : "../../../public/InStock-Logo_1x.png"
  );

  // Update activeButton based on the current location pathname.
  useEffect(() => {
    if (location.pathname.includes('warehouses')) {
      setActiveButton('warehouses');
    } else if (location.pathname.includes('inventories')) {
      setActiveButton('inventories');
    } else {
      setActiveButton('');
    }
  }, [location.pathname]);

  // Listen for window resize events to update the logo instantly.
  useEffect(() => {
    const handleResize = () => {
      const newLogo =
        window.innerWidth < 768
      ? "../../../public/InStock-Logo_2x.png"
      : "../../../public/InStock-Logo_1x.png"   
      setLogoSrc(newLogo);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handler to activate a button and navigate if it is inactive.
  const handleButtonClick = (buttonName) => {
    if (activeButton !== buttonName) {
      setActiveButton(buttonName);
    }
  };

  return (
    <header className="header">
        <div className="header_section">
            <div>
                <Link to="/warehouses">
                <img
                    className="header_section_logo"
                    src="../../../public/InStock-Logo_1x.png"   
                    alt="This is our website logo"
                    />
                </Link>
            </div>

            <div className="header_section_buttons">
            <Link to="/warehouses" className='header_section_buttons_width'>
            <button
                className={`header_section_buttons_warehouses ${activeButton === 'warehouses' ? 'active' : ''}`}
                onClick={() => handleButtonClick('warehouses')}
            >
                <p>Warehouses</p>
            </button>
            </Link>
            <Link to="/inventories" className='header_section_buttons_width'>
            <button
                className={`header_section_buttons_inventories ${activeButton === 'inventories' ? 'active' : ''}`}
                onClick={() => handleButtonClick('inventories')}
            >
                <p>Inventories</p>
            </button>
            </Link>
            </div>
        </div>
    </header>
  );
};

export default Header;
