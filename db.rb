# frozen_string_literal: true

require 'sequel'
class DB
  attr_reader :shoes, :stores

  def initialize
    db = Sequel.sqlite # memory database, requires sqlite3

    stores_table(db)
    shoes_table(db)

    @shoes = db[:shoes]
    @stores = db[:stores]
  end

  private
  def stores_table(db)
    db.create_table :stores do
      primary_key :id
      String :name
    end
  end

  def shoes_table(db)
    db.create_table :shoes do
      primary_key :id
      String :name
      Integer :quantity
      Integer :store_id
    end
  end
end
