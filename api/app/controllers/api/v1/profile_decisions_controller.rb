module Api
  module V1
    class ProfileDecisionsController < BaseController
      def create
        session = current_user.exploration_sessions.find(decision_params[:exploration_session_id])
        decision = session.profile_decisions.create!(
          viewed_user_id: decision_params[:viewed_user_id],
          action: decision_params[:action]
        )
        render json: decision, status: :created
      end

      private

      # "action" nested under profile_decision avoids colliding with the
      # routing-reserved top-level params[:action] (the controller action name).
      def decision_params
        params.require(:profile_decision).permit(:exploration_session_id, :viewed_user_id, :action)
      end
    end
  end
end
