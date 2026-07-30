class ExplorationSession < ApplicationRecord
  belongs_to :user
  belongs_to :location
  has_many :profile_decisions

  before_create { self.started_at ||= Time.current }

  def eligible_profiles
    User.where(live_location_id: location_id)
        .where.not(id: user_id)
        .where.not(id: profile_decisions.select(:viewed_user_id))
  end
end
