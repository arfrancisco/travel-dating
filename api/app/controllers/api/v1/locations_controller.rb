module Api
  module V1
    class LocationsController < BaseController
      def index
        render json: Location.all.order(:name)
      end
    end
  end
end
