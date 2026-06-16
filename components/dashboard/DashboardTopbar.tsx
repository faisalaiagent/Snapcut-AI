"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut, Bell } from "lucide-react";
import type { User } from "next-auth";

interface DashboardTopbarProps {
  user: User & { plan?: string };
}

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  return (
    <header className="h-[60px] border-b border-surface-3 bg-white flex items-center justify-between px-6 flex-shrink-0">
      <div className="text-[14px] text-ink-3 font-light">
        Welcome back, <span className="text-ink font-medium">{user.name?.split(" ")[0] ?? "there"}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications placeholder */}
        <button className="p-2 rounded-xl hover:bg-surface-2 text-ink-4 hover:text-ink transition-all">
          <Bell className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-[13px] font-semibold">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-[13px] font-medium text-ink leading-none">{user.name}</p>
            <p className="text-[11px] text-ink-4 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="p-2 rounded-xl hover:bg-surface-2 text-ink-4 hover:text-red-500 transition-all"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
