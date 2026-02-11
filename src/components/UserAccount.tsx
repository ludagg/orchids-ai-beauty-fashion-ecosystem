"use client";

export default function UserAccount({ showLabel = true }: { showLabel?: boolean }) {
  return (
    <button className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-[#f5f5f5] transition-colors border border-transparent hover:border-[#e5e5e5]">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-rose-500 flex items-center justify-center text-white font-medium text-xs">
        JD
      </div>
      {showLabel && (
        <span className="text-sm font-medium hidden sm:inline">Guest User</span>
      )}
    </button>
  );
}
