
# Summon Beast API

This Roll20 API script is meant for use in a D&D 5e campaign. It updates a character sheet for the bestial spirit npc created by the Summon Beast spell based on the level the spell was cast at, the type of creature being summoned, and the spell attack bonus of the caster.

## How it Works

The summon beast API checks all graphic objects added to a map to see if they reference the Bestial Spirit character. When a graphic referencing the character is present on a map, the summon beast API command can be entered to update the character's stats.

## Using the API

### Creating the Bestial Spirit Character Sheet

Needs a default token to represent the character.
Name must be "Bestial Spirit".
Must be created using the NPC character creator.
Must have the following actions: Multiattack, Maul

### Running the API Command

When a token representing the Bestial Spirit character is present added to the map, you can enter the Summon Beast API command to adjust its stats based on the given type, spell level, and spell attack bonus.

##### Command Format

`!summon-beast <beast_type> <spell_level> <spell_attack_bonus>`

##### Command Parameters

- **Beast Type**
A word describing the type of beast being summoned, either "air", "land", or "water".

- **Spell Level**
A number indicating the level the Summon Beast spell was cast at.

- **Spell Attack Bonus**
 A number describing the spell attack bonus of the creature casting the Summon Beast spell.

### Error Messages

## Known Issues

- API will not recognize if a token present on a map is changed to represent the Bestial Spirit character sheet.
- If any character sheet has the phrase "Bestial Spirit" in its name, the API will try to update that character sheet.
	- If the character sheet is not an NPC with actions named "Maul" and "Multiattack" the API will fail and stop all other APIs attached to the campaign.
- Having multiple tokens on the map that represent the same Bestial Spirit character will result in unusual behavior.
	- If one of the tokens is removed from the map the API will register that the Bestial Spirit has been removed from the board; the API command will think that no tokens representing the Bestial Spirit are present.
- This API is only designed for D&D 5e campaigns.

# License

All of the code of the API scripts in this repository is released under the MIT license (see  [LICENSE](https://github.com/Roll20/roll20-api-scripts/blob/master/LICENSE)  for details). If you contribute a new script or help improve an existing script, you agree that your contribution is released under the MIT License as well.