# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_07_30_051732) do
  create_table "exploration_sessions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "ended_at"
    t.float "latitude"
    t.integer "location_id", null: false
    t.float "longitude"
    t.float "radius_km", default: 25.0
    t.datetime "started_at"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["location_id"], name: "index_exploration_sessions_on_location_id"
    t.index ["user_id"], name: "index_exploration_sessions_on_user_id"
  end

  create_table "locations", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.float "latitude"
    t.float "longitude"
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "profile_decisions", force: :cascade do |t|
    t.string "action"
    t.datetime "created_at", null: false
    t.datetime "decided_at"
    t.integer "exploration_session_id", null: false
    t.datetime "updated_at", null: false
    t.integer "viewed_user_id", null: false
    t.index ["exploration_session_id"], name: "index_profile_decisions_on_exploration_session_id"
    t.index ["viewed_user_id"], name: "index_profile_decisions_on_viewed_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.integer "age"
    t.text "bio"
    t.datetime "created_at", null: false
    t.string "gender"
    t.string "interested_in"
    t.integer "live_location_id", null: false
    t.string "name"
    t.boolean "synthetic"
    t.datetime "updated_at", null: false
    t.index ["live_location_id"], name: "index_users_on_live_location_id"
  end

  add_foreign_key "exploration_sessions", "locations"
  add_foreign_key "exploration_sessions", "users"
  add_foreign_key "profile_decisions", "exploration_sessions"
  add_foreign_key "profile_decisions", "users", column: "viewed_user_id"
  add_foreign_key "users", "locations", column: "live_location_id"
end
