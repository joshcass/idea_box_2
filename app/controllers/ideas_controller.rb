class IdeasController < ApplicationController
  def index
    @ideas = Idea.all
  end

  def create
    @idea = Idea.new(valid_params)
    if @idea.save
      render layout: false
    else
      render status: 400, layout: false, text: @idea.errors.messages
    end
  end

  def destroy
    @idea = Idea.find(params[:id])
    @idea.destroy
    render json: {status: :success}
  end

  def valid_params
    params.require(:idea).permit(:title, :body)
  end
end
