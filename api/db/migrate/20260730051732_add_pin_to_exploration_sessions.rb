class AddPinToExplorationSessions < ActiveRecord::Migration[8.1]
  def change
    add_column :exploration_sessions, :latitude, :float
    add_column :exploration_sessions, :longitude, :float
    add_column :exploration_sessions, :radius_km, :float, default: 25.0
  end
end
