# day46_thermostat.py
# A thermostat that protects its own state.


class Thermostat:
    MIN_TEMP = 10.0
    MAX_TEMP = 30.0
    MODES = ("heat", "cool", "off")
    TOLERANCE = 0.5

    def __init__(self, target=21.0, mode="heat"):
        self._history = []
        self.target = target          # validated by the setter
        self.mode = mode
        self._current = 18.0

    @property
    def target(self):
        return self._target

    @target.setter
    def target(self, value):
        value = round(float(value), 1)
        if not self.MIN_TEMP <= value <= self.MAX_TEMP:
            raise ValueError(f"Target must be between {self.MIN_TEMP} and {self.MAX_TEMP}")
        self._target = value
        self._log(f"target set to {value}")

    @property
    def mode(self):
        return self._mode

    @mode.setter
    def mode(self, value):
        if value not in self.MODES:
            raise ValueError(f"Mode must be one of {self.MODES}")
        self._mode = value
        self._log(f"mode set to {value}")

    @property
    def current(self):
        return self._current

    @property
    def action(self):
        """What the thermostat is doing right now (computed, read-only)."""
        if self._mode == "heat" and self._current < self._target - self.TOLERANCE:
            return "heating"
        if self._mode == "cool" and self._current > self._target + self.TOLERANCE:
            return "cooling"
        return "idle"

    @property
    def history(self):
        return tuple(self._history)   # a copy that can't be changed

    def read_sensor(self, temperature):
        self._current = float(temperature)

    def tick(self):
        """Simulate one minute passing."""
        if self.action == "heating":
            self._current += 0.5
        elif self.action == "cooling":
            self._current -= 0.5

    def _log(self, message):
        self._history.append(message)

    def __str__(self):
        return (f"Mode {self._mode} | target {self._target}°C | "
                f"room {self._current:.1f}°C | {self.action}")


def main():
    t = Thermostat()
    print("Commands: target 22 | mode cool | room 25 | wait 5 | history | quit")
    while True:
        print(t)
        parts = input("> ").strip().lower().split()
        if not parts:
            continue
        command, args = parts[0], parts[1:]
        try:
            if command == "quit":
                break
            elif command == "target":
                t.target = args[0]
            elif command == "mode":
                t.mode = args[0]
            elif command == "room":
                t.read_sensor(args[0])
            elif command == "wait":
                for _ in range(int(args[0]) if args else 1):
                    t.tick()
            elif command == "history":
                for line in t.history:
                    print("  -", line)
            else:
                print("Unknown command.")
        except (ValueError, IndexError) as error:
            print("Error:", error or "missing value")


if __name__ == "__main__":
    main()
