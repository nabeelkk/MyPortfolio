import { asset } from "@/data/profile";

export function Grain() {
  return (
    <div
      className="grain"
      aria-hidden="true"
      style={{ backgroundImage: `url(${asset("/images/noise.webp")})` }}
    />
  );
}
