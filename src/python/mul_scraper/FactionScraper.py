from requests_html import HTMLSession
import json
import time

class FactionScraper:

    def __init__(self, manifest):
        self.manifest = manifest

    def create_session(self, url, page_type):
        i = 5
        t = 5
        while i > 0:
            try:
                print(f"\r..... Loading page: {page_type}.", end="\r")
                response = self.session.get(url)
                print(f"\r..... Page loaded: {page_type}.", end="")
                return response
            except Exception as e:
                i -= 1
                timer = t**(3-i+1)
                print(f"\n\nSession request failed with error ({i} tries left). Sleeping {timer}s. \nException: {e}")
                time.sleep(timer)


    def scrape(self):
        self.session = HTMLSession()

        data = {}

        faction_index = self.create_session("https://masterunitlist.azurewebsites.net/Faction/Index", "faction page")
        faction_index.html.render(timeout=120)
        div_row = faction_index.html.xpath("/html/body/div[1]/div[2]/div")
        for col in div_row:
            faction_group = col.find("h3", first=True).text
            print(f"Faction Group: {faction_group}")

            faction_group_data = {}

            for faction_div in col.find("div > div"):
                data_link = faction_div.attrs["data-link"]
                faction_name = faction_div.find("strong", first=True).text
                print(f"\tFaction Name: {faction_name}")

                faction_url = f"https://masterunitlist.azurewebsites.net{data_link}"
                faction_page = self.create_session(faction_url, f"{faction_name} page")
                faction_page.html.render(timeout=120)
                faction_page_row = faction_page.html.xpath("/html/body/div[1]/div/div", first=True)

                faction_data = {}

                for era_anchor in faction_page_row.find("a"):
                    era_name = era_anchor.text
                    era_link = era_anchor.attrs["href"]
                    print(f"\t\tEra Name: {era_name}", end="")

                    era_data = []

                    era_url =f"https://masterunitlist.azurewebsites.net{era_link}"
                    era_page = self.create_session(era_url, f"{era_name} page")
                    era_page.html.render(timeout=120)

                    unit_table_tabs = {
                        "battlemech": "div#Tbattlemech",
                        "combat vehicle": "#Tcombat-vehicle",
                        "infantry": "#Tinfantry",
                        "industrial mech": "#Tindustrialmech",
                        "protomech": "#Tprotomech"
                    }

                    for unit_type, unit_table in unit_table_tabs.items():
                        print(f"\rExtracting units of type : {unit_type}", end="")
                        tab = era_page.html.find(unit_table, first=True)
                        if tab is None: continue
                        table = tab.find("tbody", first=True)
                        if table is None: continue
                        unit_table_rows = table.find("tr")
                        if unit_table_rows is None: continue
                        for row in unit_table_rows:
                            cols = row.find("td")
                            anchor = cols[0].find("a", first=True)
                            raw_unit_name = anchor.text
                            unit_link = anchor.attrs["href"]
                            unit_url = f"https://masterunitlist.azurewebsites.net{unit_link}"

                            era_data.append({
                                "unit_name": raw_unit_name,
                                "unit_url": unit_url
                            })

                    print(f"\r\t\tEra Name: {era_name} - Loaded {len(era_data)} units")

                    faction_data[era_name] = era_data
                faction_group_data[faction_name] = faction_data
            data[faction_group] = faction_group_data


        with self.manifest.open("w") as f:
            json.dump(data, f, indent=4)
