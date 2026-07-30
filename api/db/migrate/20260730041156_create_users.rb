class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :name
      t.integer :age
      t.string :gender
      t.string :interested_in
      t.text :bio
      t.references :live_location, null: false, foreign_key: { to_table: :locations }
      t.boolean :synthetic

      t.timestamps
    end
  end
end
