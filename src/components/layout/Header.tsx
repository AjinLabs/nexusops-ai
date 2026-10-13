'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  Sliders,
  Shield,
  CheckCircle,
  AlertTriangle,
  Radio,
  ChevronDown,
  Sparkles,
  Command,
  ExternalLink,
} from 'lucide-react';
import { User } from '@/types';
import { INITIAL_USERS } from '@/server/db/mock-seed';

interface HeaderProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  simulationMode: boolean;
  onToggleSimulation: (val: boolean) => void;
  onOpenCommandPalette: () => void;
}

export function Header({
  currentUser,
  onSelectUser,
  simulationMode,
  onToggleSimulation,
  onOpenCommandPalette,
}: HeaderProps) {
  const pathname = usePathname();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate dynamic breadcrumb
  const pathParts = pathname.split('/').filter(Boolean);
  const pageTitle = pathParts[0]
    ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1).replace('-', ' ')
    : 'Overview';

  return (
    <header className="h-16 border-b border-[#E8E3D8] bg-[#FFFEF9]/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-[0_2px_10px_rgba(11,84,151,0.02)]">
      {/* Left: Breadcrumbs & Human Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#7E8FA4] font-medium">Acme Corp</span>
          <span className="text-[#D9D2C3]">/</span>
          <span className="text-[#4A5B73] font-medium">Production Ops</span>
          <span className="text-[#D9D2C3]">/</span>
          <span className="text-[#0B5497] font-bold">{pageTitle}</span>
        </div>

        {/* Live cluster heartbeat pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FA] border border-[#0B5497]/20 text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0B5497] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0B5497]"></span>
          </span>
          <span className="text-[#0B5497] font-medium">Cluster us-east-1 • Healthy</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] hover:border-[#0B5497]/40 text-xs text-[#57687C] hover:text-[#0B5497] transition-all shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-[#7E8FA4]" />
          <span className="hidden sm:inline">Search actions, agents, workflows...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono bg-[#EAF2FA] text-[#0B5497] rounded-full border border-[#0B5497]/20">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>

        {/* Simulation / Production Mode Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FAF8F3] border border-[#E8E3D8]">
          <span className="text-[11px] font-semibold text-[#57687C]">Mode:</span>
          <button
            onClick={() => onToggleSimulation(!simulationMode)}
            className={`px-3 py-0.5 text-[10px] font-bold uppercase rounded-full transition-all flex items-center gap-1.5 ${
              simulationMode
                ? 'bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/30 shadow-sm'
                : 'bg-[#0B5497] text-[#FFFEF9] shadow-sm'
            }`}
          >
            <Radio className={`w-3 h-3 ${simulationMode ? 'animate-pulse text-[#B45309]' : 'text-[#FFFEF9]'}`} />
            {simulationMode ? 'Sandbox Simulation' : 'Live Production'}
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] hover:border-[#0B5497]/40 text-[#57687C] hover:text-[#0B5497] transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C53030] ring-2 ring-[#FFFEF9]" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#FFFFFF] border border-[#E8E3D8] shadow-human-lg p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E3D8]">
                <span className="text-xs font-bold text-[#0B5497] uppercase tracking-wider">
                  Needs Your Attention
                </span>
                <span className="text-[10px] text-[#0B5497] font-medium px-2 py-0.5 rounded-full bg-[#EAF2FA]">
                  2 Pending
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF8F3] border border-amber-300 hover:border-amber-400 transition-all">
                  <div className="flex items-center justify-between font-semibold text-[#B45309]">
                    <span>Governance Sign-off</span>
                    <span className="text-[10px] text-[#7E8FA4]">2m ago</span>
                  </div>
                  <p className="text-[11px] text-[#4A5B73] mt-1">
                    AP Invoice Reconciliation paused for $14,850.00 disbursement approval.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] hover:border-[#0B5497]/30 transition-all">
                  <div className="flex items-center justify-between font-semibold text-[#0B5497]">
                    <span>Budget Tracking Alert</span>
                    <span className="text-[10px] text-[#7E8FA4]">1h ago</span>
                  </div>
                  <p className="text-[11px] text-[#4A5B73] mt-1">
                    Model gateway spend at $1,482.40 of the monthly $25,000 threshold.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RBAC Persona Quick Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] hover:border-[#0B5497]/40 transition-all shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-[#0B5497] text-[#FFFEF9] text-[10px] font-bold flex items-center justify-center">
              {currentUser.name[0]}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#0E1E38] leading-none">
                {currentUser.name}
              </span>
              <span className="text-[9px] text-[#0B5497] font-medium capitalize mt-0.5">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#7E8FA4]" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#FFFFFF] border border-[#E8E3D8] shadow-human-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#E8E3D8]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0B5497]">
                  Active Role Persona
                </div>
                <div className="text-[10px] text-[#7E8FA4] mt-0.5">
                  Select a team member to test permissions & sign-offs
                </div>
              </div>
              <div className="py-1 space-y-1">
                {INITIAL_USERS.map((u) => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-[#0B5497] text-[#FFFEF9] font-semibold shadow-sm'
                          : 'text-[#4A5B73] hover:bg-[#EAF2FA] hover:text-[#0B5497]'
                      }`}
                    >
                      <div>
                        <div className={`font-semibold ${isSelected ? 'text-[#FFFEF9]' : 'text-[#0E1E38]'}`}>{u.name}</div>
                        <div className={`text-[10px] capitalize ${isSelected ? 'text-[#FFFEF9]/80' : 'text-[#7E8FA4]'}`}>
                          {u.role.replace('_', ' ')} • {u.department}
                        </div>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-[#FFFEF9]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
