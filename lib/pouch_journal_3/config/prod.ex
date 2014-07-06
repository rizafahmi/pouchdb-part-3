defmodule PouchJournal_3.Config.Prod do
  use PouchJournal_3.Config

  config :router, port: System.get_env("PORT"),
                  # Full error reports are disabled
                  consider_all_requests_local: false
                  # ip: {0, 0, 0, 0}

  config :plugs, code_reload: false

  config :logger, level: :error
end


