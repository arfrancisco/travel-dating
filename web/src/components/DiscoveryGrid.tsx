import type { Decision, Profile } from "../api/client";
import { ProfileCard } from "./ProfileCard";
import "./DiscoveryGrid.css";

interface DiscoveryGridProps {
  profiles: Profile[];
  onDecide: (profile: Profile, decision: Decision) => void;
  onViewDetails: (profile: Profile) => void;
}

// Today: a CSS grid of cards. If a card-stack layout is added later, this is
// the component that changes (positioning/gestures) — ProfileCard stays untouched.
export function DiscoveryGrid({ profiles, onDecide, onViewDetails }: DiscoveryGridProps) {
  if (profiles.length === 0) {
    return <p className="discovery-grid__empty">No more profiles here right now.</p>;
  }

  return (
    <div className="discovery-grid">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onLike={() => onDecide(profile, "like")}
          onPass={() => onDecide(profile, "pass")}
          onViewDetails={() => onViewDetails(profile)}
        />
      ))}
    </div>
  );
}
