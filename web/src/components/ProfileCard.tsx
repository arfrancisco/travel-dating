import type { Profile } from "../api/client";
import "./ProfileCard.css";

interface ProfileCardProps {
  profile: Profile;
  onLike: () => void;
  onPass: () => void;
}

// Deliberately layout-agnostic: no assumptions about grid vs. stack
// positioning live here, only profile content and the like/pass actions.
// The container component (DiscoveryGrid today, a card-stack later) owns layout.
export function ProfileCard({ profile, onLike, onPass }: ProfileCardProps) {
  return (
    <div className="profile-card">
      <div className="profile-card__body">
        <h3>
          {profile.name}, {profile.age}
        </h3>
        <p className="profile-card__meta">{profile.gender}</p>
        <p className="profile-card__bio">{profile.bio}</p>
      </div>
      <div className="profile-card__actions">
        <button type="button" className="profile-card__pass" onClick={onPass}>
          Pass
        </button>
        <button type="button" className="profile-card__like" onClick={onLike}>
          Like
        </button>
      </div>
    </div>
  );
}
