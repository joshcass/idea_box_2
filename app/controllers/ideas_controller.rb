class IdeasController < ApplicationController
  before_action :get_idea, only: [:destroy, :update]

  def index
    @ideas = Idea.all
  end

  def create
    idea = Idea.new(valid_params)
    if idea.save
      render partial: 'ideas/idea', locals: {idea: idea}, layout: false
    else
      render status: 400, layout: false, text: idea.errors.messages
    end
  end

  def update
    @idea.update_attributes(valid_params)
    render partial: 'ideas/idea', locals: {idea: @idea}, layout: false
  end

  def destroy
    @idea.destroy
    render json: {status: :success}
  end

  private

  def get_idea
    @idea = Idea.find(params[:id])
  end

  def valid_params
    params.require(:idea).permit(:title, :body, :quality, :vote)
  end
end
