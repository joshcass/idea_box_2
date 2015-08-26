class Idea < ActiveRecord::Base
  include AASM
  validates :title, presence: true, uniqueness: true
  validates :body, presence: true, uniqueness: true

  enum quality: %w(swill plausible genius)

  default_scope {order(created_at: :desc)}

  aasm column: :quality, enum: true do
    state :swill, initial: true
    state :plausible
    state :genius

    event :swill do
      transitions from: :plausible, to: :swill
    end

    event :plausible do
      transitions from: [:swill, :genius], to: :plausible
    end

    event :genius do
      transitions from: :plausible, to: :genius
    end
  end

  def update_attributes(params_hash)
    if params_hash.delete(:vote) == 'up'
      up_vote(params_hash.delete(:quality))
    else
      params_hash.delete(:vote)
      down_vote(params_hash.delete(:quality))
    end
    update(params_hash)
  end

  def up_vote(current_quality)
    case current_quality
    when 'swill'
      plausible!
    when 'plausible'
      genius!
    end
  end

  def down_vote(current_quality)
    case current_quality
    when 'plausible'
      swill!
    when 'genius'
      plausible!
    end
  end
end
