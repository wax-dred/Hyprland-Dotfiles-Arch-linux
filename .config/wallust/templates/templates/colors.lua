-- A slightly altered version of catppucchin mocha
-- stylua: ignore
local mocha = {
	rosewater = '{{color10}}',
	flamingo = '{{color8}}',
	pink = '{{color5}}',
	mauve = '{{color3}}',
	red = '{{color6}}',
	maroon = '{{color13}}',
	peach = '{{color12}}',
	yellow = '{{color8}}',
	green = '{{color5}}',
	teal = '{{color3}}',
	sky = '{{color15}}',
	sapphire = '{{color14}}',
	blue = '{{color13}}',
	lavender = '{{color12}}',
	text = '#a9fbff',
	subtext1 = '{{color10}}',
	subtext0 = '{{color9}}',
	overlay2 = '{{color8}}',
	overlay1 = '{{color7}}',
	overlay0 = '{{color2}}',
	surface2 = '#585b70',
	surface1 = '{{color3}}',
	surface0 = '{{color3}}',
	base = '#1f1f28',
	mantle = '{{color1}}',
	crust = '{{color0}}',
  text_default = { bg = '{{color9}}', fg = '#1C1B19' },
  text_hover = { bg = '{{color15}}', fg = '#1C1B19' },
  text_active = { bg = '{{color8}}', fg = '#11111B' },

  unseen_output_default = { bg = '{{color9}}', fg = '{{color6}}' },
  unseen_output_hover = { bg = '{{color15}}', fg = '{{color6}}' },
  unseen_output_active = { bg = '{{color8}}', fg = '{{color2}}' },

  scircle_default = { bg = 'rgba(0, 0, 0, 0.4)', fg = '{{color9}}' },
  scircle_hover = { bg = 'rgba(0, 0, 0, 0.4)', fg = '{{color15}}' },
  scircle_active = { bg = 'rgba(0, 0, 0, 0.4)', fg = '{{color8}}' },

  date = { fg = '{{color15}}', bg = 'rgba(0, 0, 0, 0.4)' },
  battery = { fg = '{{color14}}', bg = 'rgba(0, 0, 0, 0.4)' },
  separator = { fg = '#313244', bg = 'rgba(0, 0, 0, 0.4)' },

  label_text   = { fg = '#CDD6F4' },
  icon_default = { fg = '{{colors9}}' },
  icon_wsl     = { fg = '{{color12}}' },
  icon_ssh     = { fg = '{{color13}}' },
  icon_unix    = { fg = '{{color13}}' },

  default = { bg = '{{color8}}', fg = '#1c1b19' },

  scircle = { bg = 'rgba(0, 0, 0, 0.4)', fg = '{{color6}}' },
}

return mocha
