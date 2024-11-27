import React from 'react';
import { FitGptSidebarWrapper } from '../modules/fitGPT/style';
import { PiClipboard } from "react-icons/pi";
import { useFitGptStore } from './useFitGptStore';
import { MdOutlineAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";


export default function FitGptSidebar({ setActiveComponent }) {
  const clearMessages = useFitGptStore((state) => state.clearMessages);

  const handleReset = () => {
    clearMessages(); // Call the clearMessages function
  };

  return (
    <FitGptSidebarWrapper isOpen={true}> {/* Permanently open sidebar */}
      {/* Sidebar content */}
      <div className="sidebar open"> {/* Ensure sidebar is always in 'open' state */}
        <div className="sidebar-content">
          <div className='sidebar-menu'>
            <div className='chat-newChat  '>
              <div className='d-flex align-items-center justify-content-between'>
                <p className=' chat-text text-semibold'>Chats</p>
                <button className='btn-light' onClick={() => handleReset()}> <MdOutlineAdd size={24} />New</button>
              </div>
              <div className='search-bar'>
                <div className="search-container">
                  <AiOutlineSearch className="search-icon" style={{ color: '#0070AD', fontSize: "24px" }} />
                  <input type="text" placeholder="Search..." className="search-input" />
                </div>
              </div>
            </div>
            <div className='chat-sidebar-bottom'>
              <ul>
                <li className="text-semibold" onClick={() => setActiveComponent('savedTemplate')}>
                  <PiClipboard />
                  Saved Template
                </li>
                <li className="text-semibold">
                  <PiClipboard />
                  Data Definition
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </FitGptSidebarWrapper>
  );
}
