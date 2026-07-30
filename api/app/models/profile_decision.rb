class ProfileDecision < ApplicationRecord
  belongs_to :exploration_session
  belongs_to :viewed_user, class_name: "User"

  validates :action, inclusion: { in: %w[like pass] }

  before_create { self.decided_at ||= Time.current }
end
