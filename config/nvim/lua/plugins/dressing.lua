return {
  "stevearc/dressing.nvim",
  event = "VeryLazy",
  config = function()
    require("dressing").setup({
      input = {
        -- Configuration générale
        enabled = true,
        title_pos = "left",
        insert_only = true,

        -- Style de la fenêtre
        border = "rounded",
        relative = "editor",

        -- Position et taille
        preferred_width = 40,
        preferred_height = 1,
      },

      select = {
        enabled = true,
        backend = { "telescope" }, -- Utiliser uniquement Telescope

        -- Configuration de Telescope
        telescope = {
          layout_strategy = "bottom_pane",
          layout_config = {
            height = 0.4,
            width = 0.9,
            prompt_position = "bottom",
          },
        },
        builtin = {
          -- Display numbers for options and set up keymaps
          show_numbers = true,
          -- These are passed to nvim_open_win
          border = "rounded",
          -- 'editor' and 'win' will default to being centered
          relative = "editor",

          buf_options = {},
          win_options = {
            cursorline = true,
            cursorlineopt = "both",
            -- disable highlighting for the brackets around the numbers
            winhighlight = "Cmdline:Cmdline,Normal:Normal,FloatBorder:FloatBorder,CursorLine:Visual,Search:None",
            -- adds padding at the left border
            statuscolumn = " ",
            position = "50%",
          },
        },
      },
    })
  end,
}
