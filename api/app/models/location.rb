class Location < ApplicationRecord
  has_many :users, foreign_key: :live_location_id
  has_many :exploration_sessions

  validates :name, presence: true
end
