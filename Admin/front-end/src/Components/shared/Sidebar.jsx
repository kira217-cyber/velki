import React, { useContext, useState, useMemo } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { FaChevronDown, FaMicrophone } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { TbLogout } from "react-icons/tb";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const { motherAdmin, logout, balance, reload } = useContext(AuthContext);
  const location = useLocation(); // To get the current route

  const handleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
    setActiveSubDropdown(null);
  };

  const handleSubDropdown = (submenu) => {
    setActiveSubDropdown(activeSubDropdown === submenu ? null : submenu);
  };

  // Conditionally define Downline dropdown based on role
  let downlineDropdown = [];
  let ControllerDropdown = [];

  if (motherAdmin?.role === "MA") {
    ControllerDropdown = [
      { name: "Home Control", path: `/${"ma"}/home-control` },
      { name: "Color Control", path: `/${"ma"}/color-control` },
      // { name: "General Setting", path: `/${"ma"}/general-setting` },
      // { name: "Deposit Request", path: `/${"ma"}/deposit-request` },
      { name: "Transaction History", path: `/${"ma"}/transaction-history` },
      { name: "Withdraw Request", path: `/${"ma"}/withdraw-request` },
      { name: "Add Categories", path: `/${"ma"}/add-categories` },
      { name: "Add Game", path: `/${"ma"}/add-game` },
    ];
  }

  if (motherAdmin?.role === "MA") {
    downlineDropdown = [
      { name: "Mother Admin", path: `/${"ma"}/mother-admin` },
      { name: "Sub Admin", path: `/${"ma"}/sub-admin` },
      { name: "Master", path: `/${"ma"}/master` },
      { name: "Agent", path: `/${"ma"}/agent` },
      { name: "Sub Agent", path: `/${"ma"}/sub-agent` },
      { name: "User", path: `/${"ma"}/users` },
    ];
  } else if (motherAdmin?.role === "SA") {
    downlineDropdown = [
      { name: "Sub Admin", path: `/${"sa"}/sub-admin` },
      { name: "Master", path: `/${"sa"}/master` },
      { name: "Agent", path: `/${"sa"}/agent` },
      { name: "Sub Agent", path: `/${"sa"}/sub-agent` },
      { name: "User", path: `/${"sa"}/users` },
    ];
  } else if (motherAdmin?.role === "MT") {
    downlineDropdown = [
      { name: "Master", path: `/${"mt"}/master` },
      { name: "Agent", path: `/${"mt"}/agent` },
      { name: "Sub Agent", path: `/${"mt"}/sub-agent` },
      { name: "User", path: `/${"mt"}/users` },
    ];
  } else if (motherAdmin?.role === "AG") {
    downlineDropdown = [
      { name: "Agent", path: `/${"ag"}/agent` },
      { name: "Sub Agent", path: `/${"ag"}/sub-agent` },
      { name: "User", path: `/${"ag"}/users` },
    ];
  } else if (motherAdmin?.role === "SG") {
    downlineDropdown = [
      { name: "Sub Agent", path: `/${"sg"}/sub-agent` },
      { name: "User", path: `/${"sg"}/users` },
    ];
  } else if (motherAdmin?.role === "US") {
    downlineDropdown = [{ name: "User", path: `/${"us"}/users` }];
  }

  // Full navItems with conditional Downline
  const navItems = [
    {
      name: "Downline",
      dropdown: downlineDropdown,
    },
    {
      name: "My Account",
      dropdown: [
        {
          name: "Account Statement",
          path: `/${motherAdmin?.role.toLowerCase()}/account-statement`,
        },
        {
          name: "Account Summary",
          path: `/${motherAdmin?.role.toLowerCase()}/account-summary`,
        },
        {
          name: "Profile",
          path: `/${motherAdmin?.role.toLowerCase()}/profile`,
        },
        {
          name: "Active Log",
          path: `/${motherAdmin?.role.toLowerCase()}/active-log`,
        },
      ],
    },
    {
      name: "My Report",
      dropdown: [
        {
          name: "Profit/Loss Report by Downline",
          path: `/${motherAdmin?.role.toLowerCase()}/my-report-pnl-downline`,
        },
        {
          name: "Profit/Loss Report by Parlay Downline",
          path: `/${motherAdmin?.role.toLowerCase()}/my-report-parlay-downline`,
        },
        {
          name: "Summary Profit/Loss Report",
          path: `/${motherAdmin?.role.toLowerCase()}/my-report-summary-pnl`,
        },
        {
          name: "Profit/Loss Report by Market",
          path: `/${motherAdmin?.role.toLowerCase()}/my-report-pl-market`,
        },
        {
          name: "Profit/Loss Report by Player",
          path: `/${motherAdmin?.role.toLowerCase()}/my-report-pl-player`,
        },
        {
          name: "Profit/Loss Report by All Casino",
          path: `/${motherAdmin?.role.toLowerCase()}/my-report-pl-casino`,
        },
        {
          name: "Profit/Loss Report by Casino Downline",
          path: `/${motherAdmin?.role.toLowerCase()}/my-report-pnl-casino-downline`,
        },
        {
          name: "Spin History",
          path: `/${motherAdmin?.role.toLowerCase()}/my-report-spin`,
        },
        {
          name: "Pending Spin Users",
          path: `/${motherAdmin?.role.toLowerCase()}/my-report-spinList`,
        },
      ],
    },
    {
      name: "Management",
      dropdown: [
        {
          name: "Risk Management",
          path: `/${motherAdmin?.role.toLowerCase()}/risk-management`,
        },
        { name: "MM", path: `/${motherAdmin?.role.toLowerCase()}/mm` },
        {
          name: "Settings",
          path: `/${motherAdmin?.role.toLowerCase()}/settings`,
        },
        {
          name: "P-Settings",
          path: `/${motherAdmin?.role.toLowerCase()}/p-settings`,
        },
        { name: "Ticker", path: `/${motherAdmin?.role.toLowerCase()}/ticker` },
        {
          name: "Pop Ticker",
          path: `/${motherAdmin?.role.toLowerCase()}/pop-ticker`,
        },
        { name: "Social", path: `/${motherAdmin?.role.toLowerCase()}/social` },
        {
          name: "Upload Banner",
          path: `/${motherAdmin?.role.toLowerCase()}/upload-banner`,
        },
      ],
    },
    { name: "BetList", path: `/${motherAdmin?.role.toLowerCase()}/bet-list` },
    { name: "Live Bet", path: `/${motherAdmin?.role.toLowerCase()}/live-bet` },
    { name: "Banking", path: `/${motherAdmin?.role.toLowerCase()}/banking` },
    {
      name: "Controller",
      dropdown: ControllerDropdown,
    },
  ];

  // Find the active nav item name based on the current path
  const activeNavItemName = useMemo(() => {
    const currentPath = location.pathname;

    // Flatten navItems to include all paths (including dropdowns)
    const allNavItems = navItems.flatMap((item) =>
      item.dropdown
        ? item.dropdown.map((drop) => ({ name: drop.name, path: drop.path }))
        : [{ name: item.name, path: item.path }]
    );

    // Find the nav item whose path matches or is a prefix of the current path
    const activeItem = allNavItems.find((item) =>
      currentPath.startsWith(item.path)
    );

    return activeItem ? activeItem.name : "Downline List"; // Fallback to "Downline List"
  }, [location.pathname, navItems]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="bg-black w-72 text-white fixed h-full transition-all duration-300 overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-gray-700">
          <h1 className="text-xl font-bold text-yellow-500">Velki</h1>
        </div>

        <nav className="mt-1">
          {navItems.map((item, index) =>
            item.dropdown ? (
              <div key={index} className="border-b border-gray-700 text-[12px]">
                <button
                  onClick={() => handleDropdown(item.name)}
                  className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-700"
                >
                  <span>{item.name}</span>
                  <FaChevronDown
                    className={`transform transition-transform ${
                      activeDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeDropdown === item.name && (
                  <div className="bg-gray-800 text-[12px]">
                    {item.dropdown.map((drop, i) =>
                      drop.dropdown ? (
                        <div key={i}>
                          <button
                            onClick={() => handleSubDropdown(drop.name)}
                            className="w-full flex justify-between items-center px-6 py-2 hover:bg-gray-700"
                          >
                            <span>{drop.name}</span>
                            <FaChevronDown
                              className={`transform transition-transform ${
                                activeSubDropdown === drop.name
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>

                          {activeSubDropdown === drop.name && (
                            <div className="bg-gray-900">
                              {drop.dropdown.map((sub, j) => (
                                <NavLink
                                  key={j}
                                  to={sub.path}
                                  className={({ isActive }) =>
                                    `block px-8 py-2 ${
                                      isActive
                                        ? "bg-yellow-500 text-black font-bold"
                                        : "hover:bg-gray-700"
                                    }`
                                  }
                                >
                                  {sub.name}
                                </NavLink>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <NavLink
                          key={i}
                          to={drop.path}
                          className={({ isActive }) =>
                            `block px-6 py-2 ${
                              isActive ? "bg-yellow-500 text-black font-bold" : "hover:bg-gray-700"
                            }`
                          }
                        >
                          {drop.name}
                        </NavLink>
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-3 border-b border-gray-700 text-[12px] ${
                    isActive ? "bg-yellow-500 text-black font-bold" : "hover:bg-gray-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            )
          )}
        </nav>

        <button
          onClick={() => logout()}
          className="w-full text-left px-4 py-4 text-[12px] cursor-pointer hover:bg-yellow-500 hover:text-black hover:font-bold flex items-center gap-4"
        >
          Logout <TbLogout size={18} />
        </button>
      </aside>

      {/* Main Section */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "ml-72" : "ml-0"
        }`}
      >
        {/* Top Navbar */}
        <header className="bg-yellow-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl">{activeNavItemName}</h1>
          </div>
          <div className="px-4 py-1 rounded text-sm flex items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-400 py-1 px-2 bg-gray-700 text-[12px] font-bold">
                WL
              </span>
              <span className="">{motherAdmin?.username} [P]</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold py-1 px-2 bg-gray-700 text-[12px]">
                Main
              </span>
              <span className="">{balance}</span>
            </div>

            <button
              onClick={reload}
              className="flex items-center justify-center gap-2 hover:cursor-pointer"
            >
              <span className="font-bold py-2 px-4 bg-gray-700 text-[12px]">
                <TfiReload size={20} />
              </span>
            </button>
          </div>
        </header>

        {/* News Bar */}
        <div className="bg-[#1f2937] p-2 flex items-center gap-2">
          <FaMicrophone className="text-white" />
          <p className="text-white text-sm">News</p>
        </div>

        {/* Outlet (Dynamic Page Content) */}
        <div className="mt-4 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
