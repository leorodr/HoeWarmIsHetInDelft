from datetime import datetime
import re

from .utils import c_to_f, knots_to_mph, knots_to_kmh

# Dictionary mapping specific clientraw index positions to their meanings and default units
CLIENTRAW_MAP = {
    0: ("Header Validation Code", "12345"),
    1: ("Average Wind Speed", "knots"),
    2: ("Current Wind Gust Speed", "knots"),
    3: ("Wind Direction", "degrees"),
    4: ("Current Outdoor Temperature", "°C"),
    5: ("Current Outdoor Humidity", "%"),
    6: ("Barometric Pressure", "hPa"),
    7: ("Rain Today", "mm"),
    8: ("Total Monthly Rainfall", "mm"),
    9: ("Total Yearly Rainfall", "mm"),
    10: ("Current Rain Rate", "mm/hr"),
    11: ("Indoor Temperature", "°C"),
    12: ("Indoor Humidity", "%"),
    29: ("Current Hour", "hour"),
    30: ("Current Minute", "minute"),
    31: ("Current Second", "second"),
    32: ("Station Name-time", ""),
    35: ("Current Day", "day"),
    36: ("Current Month", "month"),
    44: ("Wind Chill", "°C"),
    45: ("Humidex (Humidity Index)", "°C"),
    46: ("Maximum Daily Temperature", "°C"),
    47: ("Minimum Daily Temperature", "°C"),
    50: ("Barometric Pressure Trend", "hPa/hr"),
    71: ("Maximum Daily Wind Gust", "knots"),
    72: ("Current Dew Point", "°C"),
    74: ("Full Date String (OS Dependent)", ""),
    75: ("Maximum Daily Humidex", "°C"),
    76: ("Minimum Daily Humidex", "°C"),
    77: ("Maximum Daily Wind Chill", "°C"),
    78: ("Minimum Daily Wind Chill", "°C"),
    90: ("Temperature One Hour Ago", "°C"),
    110: ("Maximum Daily Heat Index", "°C"),
    111: ("Minimum Daily Heat Index", "°C"),
    112: ("Current Heat Index", "°C"),
    130: ("Current Apparent Temperature", "°C"),
    131: ("Maximum Daily Barometric Pressure", "hPa"),
    132: ("Minimum Daily Barometric Pressure", "hPa"),
    136: ("Minimum Daily Apparent Temperature", "°C"),
    137: ("Maximum Daily Apparent Temperature", "°C"),
    138: ("Maximum Daily Dew Point", "°C"),
    139: ("Minimum Daily Dew Point", "°C"),
    140: ("Current Wind Gust", "knots"),
    141: ("Current Year", "year"),
    177: ("End of Record / WD Software Version", "Flag"),
}

class ClientRawParser:
    """A class to parse and interpret clientraw.txt data from weather station websites."""

    def __init__(self, content: str):
        self.content = content
        self.fields = self.content.strip().split(" ")

    def temperature(self) -> float:
        """Returns the current outdoor temperature in Celsius."""
        return float(self.fields[4])

    def check_data_freshness(self) -> bool:
        """Parses and cross-checks the weather station timestamp against current system time."""
        try:
            # Extract date and time fields dynamically
            f_hour = int(self.fields[29])
            f_minute = int(self.fields[30])
            f_day = int(self.fields[35])
            f_month = int(self.fields[36])
            # f_date = self.fields[74]  # Full date string (OS dependent)
            f_year = int(self.fields[141])

            # Safely fall back to the current local year format if weather station outputs 2-digit years
            if f_year < 100:
                f_year += 2000

            # Construct localized datetime objects (assumes station is set to local system time layout)
            station_time = datetime(f_year, f_month, f_day, f_hour, f_minute)
            current_time = datetime.now()

            # Calculate time delta divergence in total elapsed minutes
            time_diff = (current_time - station_time).total_seconds() / 60

            # use 600 minutes (10 hours) as a threshold for stale data warning
            # it would be better to account for timezone differences, but this is a simple check
            if abs(time_diff) > 600:
                return False
            else:
                return True

        except (IndexError, ValueError) as err:
            raise RuntimeError(f"Data freshness check failed: {err}")

    def parse_clientraw(self) -> bool:
        """Splits the raw text data and formats a human-friendly console output."""
        fields = self.fields

        # Basic layout structural validation
        if not fields or fields[0] != "12345":
            print(
                "Error: Invalid structure. File must begin with the header key '12345'."
            )
            return False

        # Check for the validation footer pattern (!!xx.xx!!)
        footer_pattern = re.compile(r"\d+\.\d+.*!!")
        if not footer_pattern.search(self.content):
            print(
                "Warning: Missing or corrupt end-of-record footer sequence (!!)."
            )

        # Execute data freshness timing calculation checks
        if not self.check_data_freshness():
            print(
                "Warning: Weather station timestamp is significantly out of sync with system time."
            )

        print("\n" + "=" * 70)
        print(f"PARSED CLIENTRAW DATA ({len(fields)} fields detected)")
        print("=" * 70)
        print(
            f"{'Index':<7} | {'Weather Parameter':<32} | {'Raw Value':<12} | Friendly Conversion"
        )
        print("-" * 70)

        for idx, val in enumerate(fields):
            # Look up mapped names; default unlisted fields to Generic Field identifiers
            param_name, unit = CLIENTRAW_MAP.get(idx, (f"Generic Field {idx}", ""))

            # Only process values for mapping or populated items to preserve terminal space
            if idx in CLIENTRAW_MAP or (val and val != "0" and val != "-99"):
                extra_info = ""

                try:
                    numeric_val = float(val)

                    if "knots" in unit:
                        mph = knots_to_mph(numeric_val)
                        kmh = knots_to_kmh(numeric_val)
                        fahrenheit = c_to_f(numeric_val)
                        extra_info = f"({mph:.1f} mph / {kmh:.1f} km/h)"
                    elif "°C" in unit:
                        fahrenheit = c_to_f(numeric_val)
                        extra_info = f"({fahrenheit:.1f} °F)"
                    elif "degrees" in unit:
                        dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
                        compass_dir = dirs[int((numeric_val + 22.5) % 360 / 45)]
                        extra_info = f"({compass_dir})"
                except ValueError:
                    pass

                # Structure unit labels cleanly
                unit_lbl = f" {unit}" if unit else ""
                friendly_val = f"{val}{unit_lbl}"

                print(
                    f"[{idx:<3}]   | {param_name:<32} | {friendly_val:<12} | {extra_info}"
                )

        print("=" * 70 + "\n")
        return True

