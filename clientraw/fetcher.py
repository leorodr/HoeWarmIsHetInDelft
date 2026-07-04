import urllib.request
import time
from enum import Enum

class TARGETS(Enum):
    DELFT = "https://www.weerindelft.nl/clientraw.txt"
    SARATOGA = "https://saratoga-weather.org/clientraw.txt"
    CURTISZ = "https://curtiszmweather.com/clientraw.txt"
    VENHUIZER = "https://www.venhuizerweer.nl/data/clientraw.txt"

def fetch_clientraw(target: TARGETS) -> str:
    unixtime = int(time.time() * 1000)
    target_url = (
        f"{target.value}?{unixtime}"
    )

    try:
        req = urllib.request.Request(
            target_url, headers={"User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req) as response:
            if response.status != 200:
                raise RuntimeError(
                    f"Failed to fetch data from {target.value}. "
                    f"HTTP Status: {response.status} - {response.reason}"
                )
            payload = response.read().decode("utf-8")
            if len(payload) == 0:
                raise RuntimeError(
                    f"Failed to fetch data from {target.value}. "
                    "Empty response received."
                )

        return payload

    except Exception as err:
        raise RuntimeError(f"Execution failed: {err}")
