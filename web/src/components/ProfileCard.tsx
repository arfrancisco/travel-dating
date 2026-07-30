import type { Profile } from "../api/client";
import { profilePhotoUrls } from "../api/avatars";
import "./ProfileCard.css";

interface ProfileCardProps {
  profile: Profile;
  onLike: () => void;
  onPass: () => void;
  onViewDetails: () => void;
}

// Deliberately layout-agnostic: no assumptions about grid vs. stack
// positioning live here, only profile content and the like/pass actions.
// The container component (DiscoveryGrid today, a card-stack later) owns layout.
export function ProfileCard({ profile, onLike, onPass, onViewDetails }: ProfileCardProps) {
  const [primaryPhoto] = profilePhotoUrls(profile.id, 1);

  return (
    <div className="profile-card">
      <button type="button" className="profile-card__photo-trigger" onClick={onViewDetails}>
        <img className="profile-card__photo" src={primaryPhoto} alt={`${profile.name}'s profile`} />
      </button>
      <div className="profile-card__body">
        <h3>
          {profile.name}, {profile.age}
        </h3>
        <p className="profile-card__meta">{profile.gender}</p>
        <p className="profile-card__bio">{profile.bio}</p>
        <button type="button" className="profile-card__details-link" onClick={onViewDetails}>
          View profile
        </button>
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
