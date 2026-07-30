module GeoDistance
  EARTH_RADIUS_KM = 6371.0

  def self.km_between(lat1, lon1, lat2, lon2)
    rlat1 = lat1 * Math::PI / 180
    rlat2 = lat2 * Math::PI / 180
    dlat = rlat2 - rlat1
    dlon = (lon2 - lon1) * Math::PI / 180

    a = Math.sin(dlat / 2)**2 + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(dlon / 2)**2
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    EARTH_RADIUS_KM * c
  end
end
