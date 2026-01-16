#compdef uhk

# Preferred (curated) commands
local -a preferred=(
  exec-macro-command
  get-debug-info
  get-device-state
  get-uptime
  get-variable
  send-commands
)

# Fetch all commands dynamically
local -a all
all=("${(@f)$(uhk --list-commands 2>/dev/null)}")

# Strip leading tabs (BSD-compatible sed-ish via zsh)
all=("${all[@]//$'\t'/}")

# Remove empty lines
all=("${(@)all:#}")

# Remove preferred from all to avoid duplicates
local -a remaining
remaining=("${all[@]:|preferred}")

# Provide the two UI sections
_arguments \
  '1:command:->cmds' \
  '*::args:->args'

if [[ $state == cmds ]]; then
  _describe -t preferred 'preferred commands' preferred
  _describe -t others    'all commands'       remaining
  return
fi
