class ExplorationSession < ApplicationRecord
  belongs_to :user
  belongs_to :location
  has_many :profile_decisions, dependent: :destroy

  validates :latitude, :longitude, :radius_km, presence: true

  before_create { self.started_at ||= Time.current }

  # Eligibility is a straight-line (Haversine) distance from the dropped pin,
  # not a match against a fixed city — the pin can land anywhere.
  def eligible_profiles
    already_decided = profile_decisions.select(:viewed_user_id)

    User.where.not(id: user_id)
        .where.not(id: already_decided)
        .includes(:live_location)
        .select do |candidate|
          candidate.live_location &&
            GeoDistance.km_between(latitude, longitude, candidate.live_location.latitude, candidate.live_location.longitude) <= radius_km
        end
  end
end
