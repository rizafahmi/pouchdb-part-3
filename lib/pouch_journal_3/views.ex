defmodule PouchJournal_3.Views do

  defmacro __using__(_options) do
    quote do
      use Phoenix.View, templates_root: unquote(Path.join([__DIR__, "templates"]))
      import unquote(__MODULE__)

      # This block is expanded within all views for aliases, imports, etc
      alias PouchJournal_3.Views
    end
  end

  # Functions defined here are available to all other views/templates
end


