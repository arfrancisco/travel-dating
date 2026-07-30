class CreateProfileDecisions < ActiveRecord::Migration[8.1]
  def change
    create_table :profile_decisions do |t|
      t.references :exploration_session, null: false, foreign_key: true
      t.references :viewed_user, null: false, foreign_key: { to_table: :users }
      t.string :action
      t.datetime :decided_at

      t.timestamps
    end
  end
end
