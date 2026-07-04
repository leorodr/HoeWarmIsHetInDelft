#!/usr/bin/env python3

import argparse

from clientraw import ClientRawParser, TARGETS, fetch_clientraw

LOCATION_LABELS = {
    TARGETS.DELFT: "Delft, Netherlands",
    TARGETS.CURTISZ: "Zumbrota, MI, USA",
    TARGETS.VENHUIZER: "Venhuizer, Netherlands",
    TARGETS.SARATOGA: "Saratoga, CA, USA",
}

def parse_args() -> argparse.Namespace:
    """ Parses command-line arguments to determine which website to fetch data from."""
    
    parser = argparse.ArgumentParser(
        description="Fetch and print current outdoor temperature from a weather station."
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--delft",
        action="store_true",
        help="Use Delft, Netherlands (default).",
    )
    group.add_argument(
        "--zumbrota",
        action="store_true",
        help="Use Zumbrota, MI, USA.",
    )
    group.add_argument(
        "--venhuizer",
        action="store_true",
        help="Use Venhuizer, Netherlands.",
    )
    group.add_argument(
        "--saratoga",
        action="store_true",
        help="Use Saratoga, CA, USA.",
    )
    return parser.parse_args()


def resolve_target(args: argparse.Namespace) -> TARGETS:
    """ Resolves the target weather website based on command-line arguments."""
    
    if args.zumbrota:
        return TARGETS.CURTISZ
    if args.venhuizer:
        return TARGETS.VENHUIZER
    if args.saratoga:
        return TARGETS.SARATOGA
    return TARGETS.DELFT

if __name__ == "__main__":
    args = parse_args()
    target = resolve_target(args)

    # fetch data from the website endpoint
    clientraw_data = fetch_clientraw(target)

    # init the ClientRawParser class
    clientraw_parser = ClientRawParser(clientraw_data)

    # Print Delft temperature strictly per the email instructions.
    if target == TARGETS.DELFT:
        print(
            f"{int(clientraw_parser.temperature())} degrees Celsius"
        )

    # Print other locations with a more descriptive message.
    else:
        location = LOCATION_LABELS[target]
        print(
            f"Current outdoor temperature in {location}: "
            f"{int(clientraw_parser.temperature())} °C"
        )