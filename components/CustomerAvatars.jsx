"use client";

import Image from "next/image";

export function CustomerAvatars() {
  const avatars = [
    {
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      alt: "Sarah L.",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      alt: "Marco R.",
    },
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
      alt: "Elena G.",
    },
    {
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
      alt: "Luca B.",
    },
  ];

  return (
    <div className="flex items-center gap-3.5 pt-2">
      {/* Overlapping Avatar Stack */}
      <div className="flex -space-x-2.5 items-center">
        {avatars.map((avatar, idx) => (
          <div
            key={idx}
            className="relative w-9 h-9 rounded-full ring-2 ring-white dark:ring-[#24242A] overflow-hidden shadow-xs"
          >
            <Image
              src={avatar.src}
              alt={avatar.alt}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Authentic community label */}
      <div className="text-left">
        <p className="text-xs sm:text-sm font-extrabold text-[#24242A] dark:text-white leading-tight">
          Fresh Handcrafted Pizza Community
        </p>
      </div>
    </div>
  );
}
