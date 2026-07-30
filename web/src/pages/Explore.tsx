import { useCallback, useEffect, useState } from "react";
import {
  createExplorationSession,
  fetchLocations,
  fetchProfiles,
  fetchStats,
  recordDecision,
  type Decision,
  type ExplorationSession,
  type Profile,
  type SessionStats,
} from "../api/client";
import { DiscoveryGrid } from "../components/DiscoveryGrid";
import { LocationPicker, type LatLng } from "../components/LocationPicker";
import { ProfileDetailModal } from "../components/ProfileDetailModal";
import { StatsPanel } from "../components/StatsPanel";
import "./Explore.css";

const HOME_CITY = "Manila";
const DEFAULT_RADIUS_KM = 25;
const MIN_RADIUS_KM = 5;
const MAX_RADIUS_KM = 100;

export function Explore() {
  const [pin, setPin] = useState<LatLng | null>(null);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [session, setSession] = useState<ExplorationSession | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsProfile, setDetailsProfile] = useState<Profile | null>(null);

  const startExploring = useCallback(async (position: LatLng, radius: number) => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await createExplorationSession(position.lat, position.lng, radius);
      const [fetchedProfiles, fetchedStats] = await Promise.all([
        fetchProfiles(newSession.id),
        fetchStats(newSession.id),
      ]);
      setSession(newSession);
      setProfiles(fetchedProfiles);
      setStats(fetchedStats);
    } catch {
      setError("Could not start exploring this area.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Default the pin to the test user's home city, then start exploring there.
  useEffect(() => {
    fetchLocations()
      .then((cities) => {
        const home = cities.find((city) => city.name === HOME_CITY) ?? cities[0];
        if (!home) return;
        const homePin = { lat: home.latitude, lng: home.longitude };
        setPin(homePin);
        startExploring(homePin, DEFAULT_RADIUS_KM);
      })
      .catch(() => setError("Could not load locations. Is the API running?"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecide = useCallback(
    async (profile: Profile, decision: Decision) => {
      if (!session) return;

      setProfiles((current) => current.filter((p) => p.id !== profile.id));
      setDetailsProfile((current) => (current?.id === profile.id ? null : current));

      try {
        await recordDecision(session.id, profile.id, decision);
        const updatedStats = await fetchStats(session.id);
        setStats(updatedStats);
      } catch {
        setError("Could not record that decision.");
      }
    },
    [session]
  );

  if (!pin) return <p>Loading...</p>;

  return (
    <div className="explore">
      <header className="explore__header">
        <h1>Travel Mode</h1>
      </header>

      <LocationPicker position={pin} radiusKm={radiusKm} onPositionChange={setPin} />

      <div className="explore__controls">
        <label className="explore__radius">
          Radius: {radiusKm} km
          <input
            type="range"
            min={MIN_RADIUS_KM}
            max={MAX_RADIUS_KM}
            step={5}
            value={radiusKm}
            onChange={(event) => setRadiusKm(Number(event.target.value))}
          />
        </label>
        <button type="button" onClick={() => startExploring(pin, radiusKm)} disabled={loading}>
          Explore this area
        </button>
      </div>

      {error && <p className="explore__error">{error}</p>}

      <StatsPanel stats={stats} />

      {loading ? (
        <p>Loading profiles...</p>
      ) : (
        <DiscoveryGrid profiles={profiles} onDecide={handleDecide} onViewDetails={setDetailsProfile} />
      )}

      {detailsProfile && (
        <ProfileDetailModal
          profile={detailsProfile}
          onClose={() => setDetailsProfile(null)}
          onLike={() => handleDecide(detailsProfile, "like")}
          onPass={() => handleDecide(detailsProfile, "pass")}
        />
      )}
    </div>
  );
}
