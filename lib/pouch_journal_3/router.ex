defmodule PouchJournal_3.Router do
  use Phoenix.Router

  plug Plug.Static, at: "/static", from: :pouch_journal_3
  get "/", PouchJournal_3.Controllers.Pages, :index, as: :page
end
