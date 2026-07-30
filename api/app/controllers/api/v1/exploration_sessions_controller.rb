module Api
  module V1
    class ExplorationSessionsController < BaseController
      def create
        location = Location.find(params[:location_id])
        session = current_user.exploration_sessions.create!(location: location)
        render json: session, status: :created
      end

      def profiles
        session = current_user.exploration_sessions.find(params[:id])
        eligible = session.eligible_profiles.order(Arel.sql("RANDOM()")).limit(20)
        render json: eligible.as_json(only: [:id, :name, :age, :gender, :interested_in, :bio])
      end

      def stats
        session = current_user.exploration_sessions.find(params[:id])
        decisions = session.profile_decisions

        render json: {
          location: session.location.name,
          eligible_remaining: session.eligible_profiles.count,
          viewed: decisions.count,
          liked: decisions.where(action: "like").count,
          passed: decisions.where(action: "pass").count
        }
      end
    end
  end
end
