class Location < ApplicationRecord
  has_many :users, foreign_key: :live_location_id
  has_many :exploration_sessions

  validates :name, presence: true

  def self.nearest_to(latitude, longitude)
    all.min_by { |location| GeoDistance.km_between(latitude, longitude, location.latitude, location.longitude) }
  end
end
