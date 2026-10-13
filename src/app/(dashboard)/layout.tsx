'use client';

import React, { useState, Suspense } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_USERS } from '@/server/db/mock-seed';
import { User } from '@/types';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Alex Mercer by default
  const [simulationMode, setSimulationMode] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FFFEF9] text-[#0E1E38]">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar currentUser={currentUser} />

      {/* Main Execution Canvas & Work Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-[#FFFEF9]">
        <Header
          currentUser={currentUser}
          onSelectUser={setCurrentUser}
          simulationMode={simulationMode}
          onToggleSimulation={setSimulationMode}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-[#FFFEF9] p-6 text-[#0E1E38]">
          {children}
        </main>
      </div>

      {/* Command Palette Modal (Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#FFFEF9] text-[#0B5497] flex items-center justify-center font-mono text-xs">
          Loading NexusOps Operations...
        </div>
      }
    >
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
