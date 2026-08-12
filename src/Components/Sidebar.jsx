import React from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Building2,
  ClipboardList,
  BarChart3,
  Users,
} from "lucide-react";


const Sidebar = () => {

  const donorLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Create Donation",
      path: "/create-donation",
      icon: PlusCircle,
    },
    {
      name: "My Donations",
      path: "/my-donations",
      icon: Package,
    },
  ];


  const ngoLinks = [
    {
      name: "NGO Dashboard",
      path: "/ngo-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Available Donations",
      path: "/available-donations",
      icon: Package,
    },
    {
      name: "My Claims",
      path: "/claims",
      icon: ClipboardList,
    },
  ];


  const commonLinks = [
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "NGOs",
      path: "/ngos",
      icon: Users,
    },
  ];


  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-green-100 text-green-700 font-semibold"
        : "text-gray-600 hover:bg-gray-100"
    }`;


  return (
    <aside className="hidden md:block w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200">

      <div className="p-4">

        {/* Donor Section */}
        <p className="text-xs font-semibold text-gray-400 uppercase px-4 mb-2">
          Donor
        </p>

        <div className="space-y-1">

          {donorLinks.map((link) => {

            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={linkClass}
              >
                <Icon size={19} />

                <span>
                  {link.name}
                </span>
              </NavLink>
            );
          })}

        </div>


        {/* NGO Section */}
        <p className="text-xs font-semibold text-gray-400 uppercase px-4 mt-7 mb-2">
          NGO
        </p>

        <div className="space-y-1">

          {ngoLinks.map((link) => {

            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={linkClass}
              >
                <Icon size={19} />

                <span>
                  {link.name}
                </span>
              </NavLink>
            );
          })}

        </div>


        {/* Other Section */}
        <p className="text-xs font-semibold text-gray-400 uppercase px-4 mt-7 mb-2">
          Other
        </p>

        <div className="space-y-1">

          {commonLinks.map((link) => {

            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={linkClass}
              >
                <Icon size={19} />

                <span>
                  {link.name}
                </span>
              </NavLink>
            );
          })}

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;