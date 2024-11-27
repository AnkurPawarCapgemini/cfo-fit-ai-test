import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdSpaceDashboard } from "react-icons/md";
import { CiChat1 } from "react-icons/ci";
import { TbReportSearch } from "react-icons/tb";
import { NavbarWrapper } from './style';

export default function Navbar({ isOpen }) {
  return (
    <NavbarWrapper>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? 'active' : undefined}
            >
              <MdSpaceDashboard className="menu-icon" />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/fit_gpt"
              className={({ isActive }) => isActive ? 'active' : undefined}
            >
              <CiChat1 className="menu-icon" />
              {isOpen && <span>Fit GPT</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) => isActive ? 'active' : undefined}
            >
              <TbReportSearch className="menu-icon" />
              {isOpen && <span>Reports</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </NavbarWrapper>
  );
}
