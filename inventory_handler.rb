require 'faye/websocket'
require 'eventmachine'
require 'json'

# Responsible for receiving and handling inventory updates
class InventoryHandler
  def initialize
    EM.run do
      ws = Faye::WebSocket::Client.new('ws://localhost:8080/')

      ws.on :message do |event|
        p JSON.parse(event.data)
      end
    end
  end
end