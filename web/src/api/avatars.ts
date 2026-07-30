// Synthetic profiles need synthetic photos. DiceBear generates illustrated
// avatars (not real people's photos) deterministically from a seed, so we can
// derive a stable little "photo set" per profile purely from its id — no
// storage, no scraping, no real photo rights concerns.
const PHOTOS_PER_PROFILE = 4;

export function profilePhotoUrls(profileId: number, count = PHOTOS_PER_PROFILE): string[] {
  return Array.from(
    { length: count },
    (_, index) => `https://api.dicebear.com/9.x/avataaars/svg?seed=profile-${profileId}-${index}`
  );
}
