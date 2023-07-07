#AS 350 list builder

## Implemented Validations
- Automatically excludes experimental and unique units
- Should correctly associate the general lists: IS General/IS Clan/HW Clan/Periphery units with qualifying factions.
- Validates number of `ART` units in roster.
- Validates number of `JMPS` units in roster.
- Validates roster is within 350 PV
- Validates number of ProtoMechs
- Validates number of Infantry
- Validates number of Conventional Vehicles
- Validates total number of Mechs (BatleMechs, ProtoMechs, IndustrialMechs)

## TODO
- add a modal popup with planned features list.
- add collection manager to allow adding a list of "chassis" that a user has in their collection
  - need to figure out how to do this exactly as there isn't a specific chasis field in the data
  - could also track if the model is painted
  - could also support a strict mode where the exact model can be tracked instead of just the chassis
  - allow filtering search results on model collection
- Add list export
  - probably need a coversheet with the roster details.
  - Possibly use print style sheets that load the unit cards
- add some indicator for the last time data was scraped from the MUL
- need to figure out how to apply the chassis / variant validation, as those fields are not clean in the MUL data.
- Add a means of building 200 point sub-lists, and adding notes about them.
  - Stealing an idea from discord, also add a tool for generating combinations of ~200 points, and then allows saving 
    if the user likes the generated option.

- 