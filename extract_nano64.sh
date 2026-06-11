#!/bin/sh
PULSE_FILE="nano64_repo.pulse"

if [ ! -f "$PULSE_FILE" ]; then
  echo "Missing $PULSE_FILE"
  exit 1
fi

current_file=""
collecting=0
tmp_content="$(mktemp)"

cleanup() {
  rm -f "$tmp_content"
}
trap cleanup EXIT

while IFS= read -r line; do
  case "$line" in
    PULSE\ *)
      # header, ignore
      ;;
    FILE\ *)
      # start new file
      if [ "$collecting" -eq 1 ] && [ -n "$current_file" ]; then
        mkdir -p "$(dirname "$current_file")"
        printf "%s" "$(cat "$tmp_content")" > "$current_file"
        : > "$tmp_content"
      fi
      current_file="${line#FILE }"
      collecting=1
      ;;
    END)
      if [ "$collecting" -eq 1 ] && [ -n "$current_file" ]; then
        mkdir -p "$(dirname "$current_file")"
        printf "%s" "$(cat "$tmp_content")" > "$current_file"
        : > "$tmp_content"
        current_file=""
        collecting=0
      fi
      ;;
    ENDPULSE)
      break
      ;;
    *)
      if [ "$collecting" -eq 1 ]; then
        printf "%s\n" "$line" >> "$tmp_content"
      fi
      ;;
  esac
done < "$PULSE_FILE"

echo "nano64 repo extracted."
