module Api
  module V1
    class ExplorationSessionsController < BaseController
      DEFAULT_RADIUS_KM = 25.0

      def create
        location = Location.nearest_to(session_params[:latitude], session_params[:longitude])
        session = current_user.exploration_sessions.create!(
          location: location,
          latitude: session_params[:latitude],
          longitude: session_params[:longitude],
          radius_km: session_params[:radius_km] || DEFAULT_RADIUS_KM
        )
        render json: session, status: :created
      end

      def profiles
        session = current_user.exploration_sessions.find(params[:id])
        eligible = session.eligible_profiles.sample(20)
        render json: eligible.as_json(only: [:id, :name, :age, :gender, :interested_in, :bio])
      end

      def stats
        session = current_user.exploration_sessions.find(params[:id])
        decisions = session.profile_decisions

        render json: {
          location: session.location.name,
          radius_km: session.radius_km,
          eligible_remaining: session.eligible_profiles.count,
          viewed: decisions.count,
          liked: decisions.where(action: "like").count,
          passed: decisions.where(action: "pass").count
        }
      end

      private

      def session_params
        params.require(:exploration_session).permit(:latitude, :longitude, :radius_km)
      end
    end
  end
end
