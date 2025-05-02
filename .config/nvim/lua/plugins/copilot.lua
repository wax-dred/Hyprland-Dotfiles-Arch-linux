return {
  {
    "zbirenbaum/copilot.lua",
    cmd = "Copilot",
    event = "InsertEnter",
    config = function()
      require("copilot").setup({
        suggestion = {
          auto_trigger = true,
          keymap = {
            accept = "<C-X>", -- Accepte une suggestion
            dismiss = "<C-W>", -- Rejette une suggestion
            next = "<C-L>", -- Suggère la suivante
          },
        },
        panel = {
          enabled = true,
          auto_refresh = true,
        },
      })
    end,
  },
}
