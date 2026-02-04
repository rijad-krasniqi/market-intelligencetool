import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ScrollToTop from '../common/ScrollToTop';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F0B1A]">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content area - offset by sidebar width on desktop */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? 'lg:ml-16' : 'lg:ml-64'
        } ml-0`}
      >
        <Outlet />
      </main>

      <ScrollToTop />
    </div>
  );
}
