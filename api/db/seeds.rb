# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

CITIES = {
  "Manila" => [14.5995, 120.9842],
  "Cebu" => [10.3157, 123.8854],
  "Tokyo" => [35.6762, 139.6503],
  "Singapore" => [1.3521, 103.8198],
  "London" => [51.5074, -0.1278],
  "Makati" => [14.5547, 121.0244],
  "Quezon City" => [14.6760, 121.0437],
  "Pasig" => [14.5764, 121.0851]
}.freeze

GENDERS = %w[man woman nonbinary].freeze
PROFILES_PER_CITY = 100

locations = CITIES.map do |name, (lat, lng)|
  Location.find_or_create_by!(name: name) do |location|
    location.latitude = lat
    location.longitude = lng
  end
end

manila = locations.find { |l| l.name == "Manila" }

User.find_or_create_by!(name: "Test User", synthetic: false) do |user|
  user.age = 28
  user.gender = GENDERS.sample
  user.interested_in = GENDERS.sample(2).join(",")
  user.bio = "The primary test user for exploring Travel Mode."
  user.live_location = manila
end

locations.each do |location|
  existing = User.where(synthetic: true, live_location: location).count
  next if existing >= PROFILES_PER_CITY

  (PROFILES_PER_CITY - existing).times do
    User.create!(
      name: Faker::Name.first_name,
      age: rand(21..45),
      gender: GENDERS.sample,
      interested_in: GENDERS.sample(rand(1..2)).join(","),
      bio: Faker::Lorem.paragraph(sentence_count: 2),
      live_location: location,
      synthetic: true
    )
  end

  puts "Seeded #{location.name}: #{User.where(synthetic: true, live_location: location).count} profiles"
end

puts "Total users: #{User.count} (#{User.where(synthetic: false).count} real, #{User.where(synthetic: true).count} synthetic)"
