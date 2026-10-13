'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Layers,
  CheckCircle2,
  Lock,
  Mail,
  ChevronDown,
  X,
} from 'lucide-react';
import { INITIAL_USERS, INITIAL_ORGANIZATIONS } from '@/server/db/mock-seed';
import { User, UserRole } from '@/types';

export default function TeamManagementPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('workflow_developer');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleInvite = () => {
    if (!inviteName || !inviteEmail) return;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: inviteRole,
      orgId: 'org_acme',
      workspaceId: 'ws_prod',
      department: 'Enterprise Automation',
    };

    setUsers([...users, newUser]);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    setFeedback(`✓ Invitation sent to ${inviteEmail} with role [${inviteRole.toUpperCase()}]`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const rolesList: { role: UserRole; title: string; desc: string }[] = [
    { role: 'platform_admin', title: 'Platform Admin', desc: 'Infrastructure & platform health' },
    { role: 'org_owner', title: 'Organization Owner', desc: 'Full billing, workspace & member control' },
    { role: 'ai_architect', title: 'AI Architect', desc: 'Agent design, prompt tuning, versioning' },
    { role: 'workflow_developer', title: 'Workflow Developer', desc: 'Canvas DAG authoring & debugging' },
    { role: 'approver', title: 'Approver', desc: 'Governance sign-off for critical risks' },
    { role: 'auditor', title: 'Auditor', desc: 'Read-only access to tamper-proof logs' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Organization & Team Access
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 font-mono">
              TENANT: ACME ENTERPRISE
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Enterprise RBAC role bindings, workspace member assignments, and least-privilege security scoping.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" /> Invite Member
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-[#EBF8F0] border border-[#16803C]/20 text-xs font-medium text-[#16803C] flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Members Table */}
      <div className="rounded-2xl bg-white border border-[#E8E3D8] overflow-hidden shadow-human">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E8E3D8] bg-[#FAF8F3] text-[#7E8FA4] text-[11px] uppercase font-semibold">
              <th className="py-3 px-4">Member Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Workspace Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E3D8]">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#FAF8F3] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#0E1E38] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#EAF2FA] border border-[#0B5497]/20 text-[#0B5497] flex items-center justify-center font-bold text-[10px]">
                    {u.name[0]}
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#4A5B73]">{u.email}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20">
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#4A5B73]">{u.department}</td>
                <td className="py-3.5 px-4 text-[#4A5B73] font-mono text-[11px]">
                  Production Ops, Staging QA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permission Matrix Card */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-4 shadow-human">
        <h2 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wider">
          Enterprise RBAC Permission Hierarchy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {rolesList.map((r, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] space-y-1 text-xs"
            >
              <div className="font-bold text-[#0B5497] flex items-center gap-1.5 font-mono">
                <Shield className="w-3.5 h-3.5" />
                {r.title}
              </div>
              <p className="text-[11px] text-[#4A5B73] leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#E8E3D8] p-6 shadow-human-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D8]">
              <h3 className="text-sm font-bold text-[#0E1E38]">Invite Organization Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-[#7E8FA4] hover:text-[#0E1E38]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-semibold text-[#0E1E38]">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Hayes"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0E1E38]">Corporate Email</label>
                <input
                  type="email"
                  placeholder="jordan.hayes@acme.corp"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0E1E38]">Role Assignment</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] focus:border-[#0B5497] focus:outline-none"
                >
                  <option value="workflow_developer">Workflow Developer</option>
                  <option value="ai_architect">AI Architect</option>
                  <option value="approver">Approver</option>
                  <option value="auditor">Auditor</option>
                  <option value="operator">Operator</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E3D8]">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-full text-xs text-[#4A5B73] hover:text-[#0E1E38]"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteName || !inviteEmail}
                className="px-5 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-sm"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
