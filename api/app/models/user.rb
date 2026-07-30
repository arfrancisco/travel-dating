class User < ApplicationRecord
  belongs_to :live_location, class_name: "Location"
  has_many :exploration_sessions
  has_many :profile_decisions, foreign_key: :viewed_user_id

  validates :name, :age, :gender, :interested_in, :live_location, presence: true
end
