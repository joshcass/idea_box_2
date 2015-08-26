Rails.application.routes.draw do
  root to: 'ideas#index'
  resources :ideas, only: [:index, :create, :destroy, :update]
end
