"use client"

import { cn } from "@/lib/utils"

interface Avatar {
  imageUrl: string
  profileUrl: string
}
interface AvatarCirclesProps {
  className?: string
  numPeople?: number
  avatarUrls: Avatar[]
}

export const AvatarCircles = ({ numPeople, className, avatarUrls }: AvatarCirclesProps) => {
  return (
    <div className={cn("z-10 flex -space-x-4", className)}>
      {avatarUrls.map((url, index) => (
        <a key={index} href={url.profileUrl}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-10 w-10 rounded-full border-2 border-background object-cover"
            src={url.imageUrl}
            width={40}
            height={40}
            alt={`Avatar ${index + 1}`}
          />
        </a>
      ))}
      {(numPeople ?? 0) > 0 && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-accent text-center text-xs font-medium text-accent-foreground">
          +{numPeople}
        </span>
      )}
    </div>
  )
}
