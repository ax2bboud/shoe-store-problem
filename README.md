# Shoe Store

## Solution

This is my submission for this challenge. Is it the best implementation or solution? Not even close. But I tried to limit myself to a reasonable amount of time to complete this. 

I'd like to think that I, at least, laid the foundation to a potential solid solution on the server side. If I had more time, I would run a full Rails app to make use of ORM and passthrough the websocket calls through my Rails server saving the data into objects and exposing them on a fully-fledged JSON API with CRUD capabilities. Or maybe, I could store the different inventory updates with timestamps for BI purposes down the line.

For the front-end, I would have preferred to have a more user friendly experience that represents the data in a more visual format. People are better at pattern recognition, than reading a bunch of text.

## Synopsis

Aldo Shoes is having a huge flash sale online. You provide support to the inventory department. They want to react real-time to various inventory problems as they arise.

You adjust the inventory whenever a new sale is completed. The return value includes the store, the shoe model and the inventory left for that shoe model in the store.

```
{
  'store' => 'ALDO Ste-Catherine',
  'model' => 'ADERI',
  'inventory' => 10,
}
```

`ALDO Ste-Catherine` store sold a pair of `ADERI` shoes. `ALDO Ste-Catherine` now has 10 pairs of `ADERI` left.

## Goal

**Design an interface that would allow the inventory department to monitor Aldo's stores and shoes inventory.**

Hope you’ll have fun with this little test. I know I had designing it.
Go wild. It can be anything you want. I’ve seen results printed to console, displayed on a webpage, and even someone who did periodical database dumps.

Here are a few ideas if you need an extra challenge:

- Add some sort of alerting system, e.g. When a shoe model at a store goes too low, or too high.
- Add a REST JSON API, or GraphQL
- Suggest shoe transfers from one store to another according to inventory
- Your own crazy idea!

Share your repository with us when you’re done.

Happy Hacking :)

## Installation

This projects uses the popular library `websocketd` to send messages.

If you're on a Mac, you can install `websocketd` using [Homebrew](http://brew.sh/). Just run `brew install websocketd`. For other operating systems, or if you don't want to use Homebrew, check out the link below.

**[Download for Linux, OS X and Windows](https://github.com/joewalnes/websocketd/wiki/Download-and-install)**

Note that a Ubuntu 64-bit version is already bundled here `bin/websocketd` for convenience.

## Getting Started

### Inventory Server

Your WebSocket Server is the tap that aggregates inventories from all stores.

You can run it directly from your own machine.

Run the following to start tapping into the inventory events.

```
(bin/)websocketd --port=8080 ruby inventory.rb
```

You now have an active connection to their stores opened on port 8080.

### Sinatra Server

The Sinatra server passing through the inventory updates needs to be run through your preferred terminal.

But first, we must install the gem dependencies listed in the Gemfile:

```
bundle install
```

After that, the server can be started with the following command:

```
ruby app.rb
```

To view the front-end of the app, please navigate to your [localhost](http://localhost/).

### Start listening on each event

Listen and react on each event using a WebSocket client.

Various implementations are at your disposal. Whatever floats your boat.

They all work the same way. Provide a method or a block to be executed whenever a new event occurs.

Here are two examples for our favorite languages:

#### Javascript

Open a console on a non-secured page:

```
var ws = new WebSocket('ws://localhost:8080/');

ws.onmessage = function(event) {
  console.log(event.data);
};
```

#### Ruby

##### Installation

```
gem install faye-websocket
gem install eventmachine
```

##### Example

```
require 'faye/websocket'
require 'eventmachine'
require 'json'

EM.run {
  ws = Faye::WebSocket::Client.new('ws://localhost:8080/')

  ws.on :message do |event|
    p JSON.parse(event.data)
  end
}
```
