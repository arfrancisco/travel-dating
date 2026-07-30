module Api
  module V1
    class BaseController < ApplicationController
      private

      # No real auth for the POC — always operate as the single seeded test user.
      def current_user
        @current_user ||= User.find_by!(synthetic: false)
      end
    end
  end
end
