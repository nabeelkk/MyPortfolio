"use client";

import Image from "next/image";
import { useState } from "react";
import type { ImageAsset } from "@/data/types";
import { asset } from "@/data/profile";
import { GeneratedCover } from "./GeneratedCover";
import { cn } from "@/lib/cn";

interface Props {
  image?: ImageAsset;
  /** Used for the generated fallback cover. */
  name: string;
  stack?: string[];
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Show the "Design concept" caption when the image is a concept. */
  caption?: boolean;
}

/** Image that never breaks: missing or failing images become a generated cover. */
export function SmartImage({ image, name, stack, className, sizes, priority, caption = true }: Props) {
  const [failed, setFailed] = useState(false);
  if (!image || failed) return <GeneratedCover name={name} stack={stack} className={className} />;
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={asset(image.src)}
        width={image.width}
        height={image.height}
        alt={image.alt}
        sizes={sizes ?? "(min-width: 1024px) 60vw, 100vw"}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top"
      />
      {caption && image.concept && (
        <span className="label-mono text-fg/80 absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[0.6rem] backdrop-blur">
          Design concept
        </span>
      )}
    </div>
  );
}
