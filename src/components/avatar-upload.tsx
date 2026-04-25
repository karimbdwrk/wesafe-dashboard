import type * as React from "react";
import { useRef, useState } from "react";

import { User } from "lucide-react";

import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  avatarUrl?: string;
  onChange?: (file: File) => void;
  size?: number;
}

export function AvatarUpload({ avatarUrl, onChange, size = 96 }: AvatarUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      onChange?.(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onChange?.(e.target.files[0]);
    }
  };

  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 transition-all",
        dragActive ? "border-blue-500 bg-blue-50" : "bg-gray-100",
      )}
      style={{ width: size, height: size }}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      tabIndex={0}
      role="button"
      aria-label="Changer l'avatar"
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt="avatar" className="h-full w-full rounded-lg object-cover" />
      ) : (
        <User className="h-1/2 w-1/2 text-gray-400" />
      )}
      <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={handleFileChange} />
      {dragActive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-blue-100 bg-opacity-50">
          <span className="font-semibold text-blue-600">Déposez votre image ici</span>
        </div>
      )}
    </div>
  );
}
