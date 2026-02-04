import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Library,
  Users,
  LineChart,
  Globe,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { getDatasetStats } from '../../utils/dataProcessing';

const navItems = [
  { path: '/', label: 'Dashboard', icon: BarChart3 },
  { path: '/ads', label: 'Ad Library', icon: Library },
  { path: '/competitors', label: 'Competitors', icon: Users },
  { path: '/analytics', label: 'Analytics', icon: LineChart },
  { path: '/geo', label: 'Geo Intel', icon: Globe },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const stats = getDatasetStats();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location, setMobileOpen]);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1A1425] border border-[#3B3255] text-[#C4B5FD] lg:hidden hover:bg-[#2D2545] transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#1A1425] border-r border-[#3B3255] flex flex-col transition-all duration-300 z-50 ${
          collapsed ? 'w-16' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-[#3B3255]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex-1">
                <h1 className="text-lg font-bold text-[#F5F3FF]">AdIntel Pro</h1>
                <p className="text-xs text-[#8B7FB5]">Competitor Intelligence</p>
              </div>
            )}
            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-[#8B7FB5] hover:text-[#F5F3FF]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-violet-600/20 text-violet-300 border-l-2 border-violet-500'
                        : 'text-[#C4B5FD] hover:bg-[#2D2545] hover:text-[#F5F3FF]'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Stats Section */}
        {!collapsed && (
          <div className="p-4 border-t border-[#3B3255]">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8B7FB5]">Total Ads</span>
                <span className="text-[#F5F3FF] font-semibold">{stats.totalAds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7FB5]">Competitors</span>
                <span className="text-[#F5F3FF] font-semibold">{stats.totalCompetitors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7FB5]">Last Update</span>
                <span className="text-[#F5F3FF] font-semibold">Feb 4, 2026</span>
              </div>
            </div>
          </div>
        )}

        {/* Collapse Toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#241E35] border border-[#3B3255] flex items-center justify-center text-[#C4B5FD] hover:text-[#F5F3FF] hover:border-violet-500 transition-all duration-200 hidden lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>
    </>
  );
}
