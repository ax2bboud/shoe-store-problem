require_relative 'inventory_handler'
require_relative 'db'
require 'sinatra/base'
require 'sinatra-websocket'
require 'thin'


def run(opts)

  # Start he reactor
  EM.run do

    # define some defaults for our app
    server  = opts[:server] || 'thin'
    host    = opts[:host]   || '0.0.0.0'
    port    = opts[:port]   || '80'
    web_app = opts[:app]

    dispatch = Rack::Builder.app do
      map '/' do
        run web_app
      end
    end

    # Start the web server. Note that you are free to run other tasks
    # within your EM instance.
    Rack::Server.start({
      app:    dispatch,
      server: server,
      Host:   host,
      Port:   port,
      signals: false,
     })
  end
end

class App < Sinatra::Base
  attr_reader :db

  configure do
    set :threaded, false
  end
  set :sockets, []
  set :public_folder,  __dir__ + '/public'

  def initialize
    super
    @db = DB.new
  end

  def shoes
    db.shoes
  end

  def stores
    db.stores
  end

  get '/' do
    if !request.websocket?
      erb :index
    else
      request.websocket do |ws|
        ws.onopen do
          settings.sockets << ws
          EM.run do
            client_ws = Faye::WebSocket::Client.new('ws://localhost:8080/')

            client_ws.on :message do |event|
              ws.send event.data
            end
          end
        end
        ws.onclose do
          warn("websocket closed")
          settings.sockets.delete(ws)
        end
      end
    end
  end
end

run app: App.new
