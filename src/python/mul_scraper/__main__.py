import requests
from time import sleep
from pathlib import Path
import json
import time
from tqdm import tqdm
from mul_scraper.FactionScraper import FactionScraper

search_url = "https://masterunitlist.azurewebsites.net/Unit/QuickList?Name={}"

output = Path("./output")
manifest = output / "manifest.json"
unit_data_path = output / "unit_data.json"

pull_factions = False
pull_units = True

if pull_factions:
    from shutil import rmtree
    if output.exists():
        rmtree(output)
    output.mkdir()

    faction_scraper = FactionScraper(manifest)

    faction_scraper.scrape()

if not pull_units:
    exit(0)

with manifest.open("r") as f:
    data = json.load(f)


unique_unit_names = set()

for faction_group in data.values():
    for faction in faction_group.values():
        for era in faction.values():
            for unit_data in era:
                unique_unit_names.add(unit_data["unit_name"])


unit_metadata = {}

pbar = tqdm(unique_unit_names)
for unit_name in pbar:
    pbar.set_description(f"Loading unit: {unit_name}")

    unit_slug = unit_name.replace(" ", "%20").replace("<", "").replace(">", "")

    i = 5
    t = 5
    while i > 0:
        try:
            response = requests.get(search_url.format(unit_slug))
            i = 0
        except Exception as e:
            i -= 1
            timer = t ** (3 - i + 1)
            print(f"\n\nSession request failed with error ({i} tries left). Sleeping {timer}s. \nException: {e}")
            time.sleep(timer)

    if response.status_code != 200:
        print()
        print(response.status_code, response.text)
        exit()

    response_data = response.json()

    for unit_obj in response_data["Units"]:
        if unit_obj["Name"].strip() == unit_name:
            unit_metadata[unit_name] = unit_obj

    sleep(0.1)


with unit_data_path.open("w") as f:
    json.dump(unit_metadata, f)




