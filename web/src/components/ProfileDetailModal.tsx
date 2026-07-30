import { useState } from "react";
import type { Profile } from "../api/client";
import { profilePhotoUrls } from "../api/avatars";
import "./ProfileDetailModal.css";

interface ProfileDetailModalProps {
  profile: Profile;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
}

export function ProfileDetailModal({ profile, onClose, onLike, onPass }: ProfileDetailModalProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = profilePhotoUrls(profile.id);

  const showPrevPhoto = () => setPhotoIndex((index) => (index - 1 + photos.length) % photos.length);
  const showNextPhoto = () => setPhotoIndex((index) => (index + 1) % photos.length);

  return (
    <div className="profile-detail-modal__backdrop" onClick={onClose}>
      <div className="profile-detail-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="profile-detail-modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="profile-detail-modal__gallery">
          <img
            className="profile-detail-modal__photo"
            src={photos[photoIndex]}
            alt={`${profile.name}, photo ${photoIndex + 1} of ${photos.length}`}
          />
          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="profile-detail-modal__nav profile-detail-modal__nav--prev"
                onClick={showPrevPhoto}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                type="button"
                className="profile-detail-modal__nav profile-detail-modal__nav--next"
                onClick={showNextPhoto}
                aria-label="Next photo"
              >
                ›
              </button>
              <div className="profile-detail-modal__dots">
                {photos.map((_, index) => (
                  <span
                    key={index}
                    className={
                      index === photoIndex
                        ? "profile-detail-modal__dot profile-detail-modal__dot--active"
                        : "profile-detail-modal__dot"
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="profile-detail-modal__body">
          <h2>
            {profile.name}, {profile.age}
          </h2>
          <p className="profile-detail-modal__meta">
            {profile.gender} · interested in {profile.interested_in}
          </p>
          <p className="profile-detail-modal__bio">{profile.bio}</p>
        </div>

        <div className="profile-detail-modal__actions">
          <button type="button" className="profile-card__pass" onClick={onPass}>
            Pass
          </button>
          <button type="button" className="profile-card__like" onClick={onLike}>
            Like
          </button>
        </div>
      </div>
    </div>
  );
}
