# HoeWarmIsHetInDelft

## Task given

1. Create a Python script called 'HoeWarmIsHetInDelft.py' that retrieves from http://www.weerindelft.nl/ the current temperature in Delft and prints it to standard output, rounded to degrees Celsius. Example expected output: 18 degrees Celsius
2. Write an appropriate dockerfile to containerize the script developed in point 1
3. Write a simple pipeline on https://www.gitlab.com that builds the container above and then executes it. We'll review the code based on clarity and correctness. It is important for the code to be robust, run correctly in a pipeline environment and to be easily troubleshooted by other DevOps engineers.

## Solution

1. HoeWarmIsHetInDelft.py
        
    - http://www.weerubdelft.nl/ is one of several Internet sites which uses a backend weather data feed centered around a text data file called "Weather-Display" (`clientraw.txt`). 
    - By placing a web call to `http://www.weerubdelft.nl/clientraw.txt?<unixtime>` we can get the latest weather station information. Also, since other websites also uses the same format we can optionally use the same code to target different locations. 
    - The code was built around a library in `clientraw` directory, which exposes a python class `ClientRawParser` and a loader function `fetch_clientraw`.
    - A simple test suite using `unittest` was added.

2. Dockerfile

    - A Dockerfile was included, using image `python:3.12-slim`

3. Pipeline

    - The proposed pipeline has 2 stages: `test` and `build`
    - `test` is straighforward and just runs the contained `unittest` suite
    - `build` will build and run the container, showing the current temperature of 2 locations, Delft and Saratoga.

## How to use

### Requirements

- Python 3.8+
- Dependencies from `requirements.txt`

### Setup

From the project root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Usage

Run from the project root.

### Default (Delft)

```bash
python3 HoeWarmIsHetInDelft.py
```

### CLI flags

- `--delft` (same as default)
- `--zumbrota`
- `--venhuizer`
- `--saratoga`

### Docker

```
# build the container
docker build -t weerindelft-demo .

# run it
docker run --rm weerindelft-demo
docker run --rm weerindelft-demo --saratoga
```

## Additional files / websites

- `notebook.ipynb` - explore/debug the clientraw library interactively (tested in vscode)
- `misc/ajaxLoader` - found in http://www.weerubdelft.nl/. Used to parse the `clientraw.txt` output, giving insight into the clientraw response contents.
- https://saratoga-weather.org/wdparser.php - this page allows inspection of Weather-Display data from any site.