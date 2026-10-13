'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Workflow,
  Sparkles,
  PlayCircle,
  ShieldAlert,
  Database,
  Plug,
  Wrench,
  Clock,
  FlaskConical,
  Activity,
  DollarSign,
  Store,
  UserCheck,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  ChevronDown,
  Layers,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { User } from '@/types';

interface SidebarProps {
  currentUser: User;
  onSwitchUser?: (user: User) => void;
  pendingApprovalsCount?: number;
}

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  alertCount?: number;
  count?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar({ currentUser, pendingApprovalsCount = 2 }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [activeOrg, setActiveOrg] = useState('Acme Enterprise Holdings');
  const [activeWs, setActiveWs] = useState('Production Operations');

  const navSections: NavSection[] = [
    {
      title: 'Command & Workflows',
      items: [
        { href: '/overview', label: 'Overview', icon: LayoutDashboard },
        { href: '/command-centre', label: 'AI Command Centre', icon: Bot, badge: 'Copilot' },
        { href: '/workflows', label: 'Workflow Studio', icon: Workflow },
        { href: '/agents', label: 'Agent Registry', icon: Sparkles, count: '10' },
        { href: '/runs', label: 'Agent Runs', icon: PlayCircle },
      ],
    },
    {
      title: 'Governance & Oversight',
      items: [
        {
          href: '/approvals',
          label: 'Approvals',
          icon: ShieldAlert,
          alertCount: pendingApprovalsCount,
        },
        { href: '/review-queue', label: 'Human Review Queue', icon: UserCheck, count: '2' },
        { href: '/tools', label: 'Tool Registry', icon: Wrench },
        { href: '/governance', label: 'Security & Governance', icon: ShieldCheck },
        { href: '/audit-logs', label: 'Audit Logs', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'Intelligence & Data',
      items: [
        { href: '/knowledge', label: 'Knowledge Hub (RAG)', icon: Database },
        { href: '/integrations', label: 'Integrations', icon: Plug },
        { href: '/schedules', label: 'Schedules & Triggers', icon: Clock },
        { href: '/evaluations', label: 'Evaluation Lab', icon: FlaskConical },
        { href: '/observability', label: 'Observability & Trace', icon: Activity },
        { href: '/costs', label: 'Cost Intelligence', icon: DollarSign },
      ],
    },
    {
      title: 'Organization & Workspace',
      items: [
        { href: '/templates', label: 'Templates & Packs', icon: Store },
        { href: '/team', label: 'Organization & Teams', icon: Users },
        { href: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen transition-all duration-300 border-r border-[#E8E3D8] bg-[#FAF8F3] z-40 select-none shadow-[2px_0_12px_rgba(11,84,151,0.03)] ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Platform Branding Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#E8E3D8] bg-[#FFFEF9]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#0B5497] text-[#FFFEF9] shadow-sm shadow-[#0B5497]/25 flex-shrink-0 group">
            <span className="font-serif italic font-bold text-lg text-[#FFFEF9] tracking-tight">
              Ni
            </span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#0B5497]">NexusOps</span>
                <span className="px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20">
                  ENTERPRISE
                </span>
              </div>
              <span className="text-[11px] text-[#57687C] truncate font-medium">Bespoke AI Platform</span>
            </div>
          )}
        </div>
      </div>

      {/* Tenant / Workspace Selector */}
      {!collapsed && (
        <div className="px-3.5 py-3 mx-3 my-3 rounded-2xl bg-[#FFFFFF] border border-[#E8E3D8] hover:border-[#0B5497]/30 transition-all flex flex-col gap-1.5 shadow-sm">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-bold tracking-wider text-[#0B5497] text-[10px] uppercase">
              <Layers className="w-3.5 h-3.5 text-[#0B5497]" />
              Active Workspace
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF2FA] text-[#0B5497] font-medium border border-[#0B5497]/20">
              Sovereign
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-[#0E1E38]">
            <span className="truncate">{activeWs}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#57687C] flex-shrink-0" />
          </div>
          <span className="text-[11px] text-[#7E8FA4] truncate">{activeOrg}</span>
        </div>
      )}

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-bold tracking-wider text-[#7E8FA4] uppercase">
                {sec.title}
              </h3>
            )}
            <div className="space-y-0.5 pt-1">
              {sec.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-150 group relative ${
                      isActive
                        ? 'bg-[#0B5497] text-[#FFFEF9] shadow-sm font-semibold'
                        : 'text-[#4A5B73] hover:text-[#0B5497] hover:bg-[#EAF2FA]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-[#FFFEF9]' : 'text-[#7E8FA4] group-hover:text-[#0B5497]'
                      }`}
                    />
                    {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span
                        className={`px-2 py-0.5 text-[9px] rounded-full font-bold uppercase tracking-wider ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {!collapsed && item.alertCount && item.alertCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] rounded-full font-bold bg-[#C53030] text-white">
                        {item.alertCount}
                      </span>
                    )}
                    {!collapsed && item.count && (
                      <span
                        className={`text-[11px] font-mono ${
                          isActive ? 'text-white/80' : 'text-[#7E8FA4] group-hover:text-[#0B5497]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Session Footer */}
      <div className="p-3 border-t border-[#E8E3D8] bg-[#FFFEF9]">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] hover:border-[#0B5497]/30 transition-all">
          <div className="w-8 h-8 rounded-full bg-[#0B5497] text-[#FFFEF9] flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
            {currentUser.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[#0E1E38] truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-[#0B5497] font-medium capitalize truncate">
                {currentUser.role.replace('_', ' ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
