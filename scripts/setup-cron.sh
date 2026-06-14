#!/usr/bin/env bash
set -e

BASE="${1:-http://localhost:3000}"
INTERVAL="${2:-60}"  # default 60 menit

# ── Systemd user timer ───────────────────────────────────
UNIT_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/systemd/user"
mkdir -p "$UNIT_DIR"

SERVICE="$UNIT_DIR/santet-fetcher.service"
TIMER="$UNIT_DIR/santet-fetcher.timer"

cat > "$SERVICE" <<SERVICEEOF
[Unit]
Description=SANTET Data Fetcher (GNews + YouTube)

[Service]
Type=oneshot
ExecStart=$(which curl) -sf "$BASE/api/cron/fetch-all"
SERVICEEOF

MINUTES=$(( INTERVAL < 1 ? 1 : INTERVAL ))
cat > "$TIMER" <<TIMEREOF
[Unit]
Description=Run SANTET fetcher every $MINUTES minutes

[Timer]
OnCalendar=*:0/$MINUTES
Persistent=true

[Install]
WantedBy=timers.target
TIMEREOF

systemctl --user daemon-reload 2>/dev/null || true
systemctl --user enable --now santet-fetcher.timer 2>/dev/null || true

echo "✓ Systemd user timer installed: every ${MINUTES}min → ${BASE}/api/cron/fetch-all"

# ── Fallback: Crontab ─────────────────────────────────
if command -v crontab &>/dev/null; then
  JOB="*/${MINUTES} * * * * $(which curl) -sf ${BASE}/api/cron/fetch-all >/dev/null 2>&1"
  (crontab -l 2>/dev/null | grep -v 'santet-fetcher' || true; echo "$JOB") | crontab -
  echo "✓ Crontab entry added: every ${MINUTES}min"
fi

echo ""
echo "To stop:  systemctl --user stop santet-fetcher.timer"
echo "To check: systemctl --user status santet-fetcher.timer"
