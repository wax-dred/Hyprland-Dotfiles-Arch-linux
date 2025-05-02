local wezterm = require("wezterm")
local commands = require("commands")
local constants = require("constants")
local act = wezterm.action
local config = wezterm.config_builder()
local mux = wezterm.mux

if os.getenv("XDG_CURRENT_DESKTOP") == "Hyprland" then
	config.enable_wayland = false
else
	config.enable_wayland = true
end

config.font = wezterm.font_with_fallback({
	{ family = "CaskaydiaCove Nerd Font" },
	{ family = "FantasqueSansM Nerd Font", scale = 1.2 },
})

-- Colors
config.colors = {
	cursor_bg = "{{color15}}",
	cursor_border = "{{color14}}",
	indexed = { [239] = "lightslategrey" },
	split = "{{color12}}",
}

-- Apparence de la barre d'onglets
config.window_frame = {
	font = wezterm.font({ family = "CaskaydiaCove Nerd Font", weight = "Regular" }),
	font_size = 12.0,
	active_titlebar_bg = "{{color7}}",
	inactive_titlebar_bg = "{{color14}}",
}

config.tab_bar_style = {
	new_tab = wezterm.format({
		{ Background = { Color = "{{color3}}" } },
	}),
	new_tab_hover = wezterm.format({
		{ Background = { Color = "{{color2}}" } },
	}),
}

-- Window settings
config.window_close_confirmation = "NeverPrompt"
config.automatically_reload_config = true
config.window_decorations = "NONE"
config.enable_tab_bar = true -- Changé à true pour supporter les onglets
config.hide_tab_bar_if_only_one_tab = true
config.macos_window_background_blur = 10
config.window_background_opacity = 0.9
config.pane_focus_follows_mouse = true

-- Performance settings
config.max_fps = 120
config.animation_fps = 120
config.front_end = "WebGpu"

-- Messages gliphs
config.warn_about_missing_glyphs = false

-- Key bindings
config.keys = {
	-- Nouvel onglet
	{
		key = "t",
		mods = "CTRL",
		action = act.SpawnTab("DefaultDomain"),
	},
	-- Fermer l'onglet
	{
		key = "w",
		mods = "CTRL",
		action = act.CloseCurrentTab({ confirm = false }),
	},
	-- Onglet suivant
	{
		key = "Tab",
		mods = "CTRL",
		action = act.ActivateTabRelative(1),
	},
	-- Onglet précédent
	{
		key = "Tab",
		mods = "CTRL|SHIFT",
		action = act.ActivateTabRelative(-1),
	},
	-- Split Horizontal
	{
		key = "x",
		mods = "CTRL|ALT",
		action = act.SplitHorizontal({ domain = "CurrentPaneDomain" }),
	},
	-- Split Vertical
	{
		key = "x",
		mods = "CTRL|SHIFT",
		action = act.SplitVertical({ domain = "CurrentPaneDomain" }),
	},
	-- close Pane
	{
		key = "q",
		mods = "CTRL",
		action = wezterm.action.CloseCurrentPane({ confirm = true }),
	},
	-- Rotation Panes
	{
		key = "Tab",
		mods = "CTRL",
		action = act.ActivatePaneDirection("Next"),
	},
	{
		key = "Tab",
		mods = "CTRL|ALT",
		action = act.ActivatePaneDirection("Prev"),
	},
}
-- Custom commands
wezterm.on("augment-command-palette", function()
	return commands
end)

wezterm.on("gui-startup", function()
	local _, pane, window = wezterm.mux.spawn_window({})
	pane:send_text(
		"wezterm cli split-pane --right --percent 20 && wezterm cli split-pane --bottom --percent 15 && clear\n"
	)
	wezterm.sleep_ms(1000)
	wezterm.mux
		.get_pane(1)
		:send_text(
			"wezterm cli split-pane --bottom --percent 3 && wezterm cli split-pane --bottom --percent 12 && clear\n"
		)
	wezterm.sleep_ms(100)
	wezterm.mux.get_pane(2):send_text("fish\n")
	wezterm.sleep_ms(100)
	wezterm.mux.get_pane(2):send_text("clear\n")
	wezterm.sleep_ms(100)
	wezterm.mux.get_pane(4):send_text("fum\n")
	wezterm.sleep_ms(100)
	wezterm.mux.get_pane(3):send_text("cava\n")
	wezterm.sleep_ms(100)
	wezterm.mux.get_pane(1):send_text("vim .config/nvim/AideKey.md\n")
	wezterm.sleep_ms(1000)
	pane:activate()
	pane:send_text("nvim\n")
end)

return config
