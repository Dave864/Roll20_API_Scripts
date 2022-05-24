
# Summon Beast API

This Roll20 API is meant for use in a D&D 5e campaign. It updates a character sheet for the bestial spirit npc created by the Summon Beast spell.

## How it Works

This API checks all graphic objects added to a map to see if they reference the Bestial Spirit character. When a graphic referencing the character is present on a map, the summon beast API command can be entered to update the character's stats.

## Using the API

### Creating the Bestial Spirit Character

The API interfaces with a character sheet that represents the Bestial Spirit.

The character sheet must be for an NPC with the name "Bestial Spirit".

The character sheet needs an action for Multiattack and an attack action for Maul.

![actions-screenshot](https://github.com/Dave864/Roll20_API_Scripts/blob/main/Screen_Shots/bestial_spirit_actions.png "Needed Actions")

:warning: The details of the actions will be changed when the API updates the Bestial Spirit.

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

### Errors Accounted For

##### Missing Bestial Spirit Token

The Bestial Spirit character sheet will not update if there is no token present on a map that represents it.

![missing-token](https://github.com/Dave864/Roll20_API_Scripts/blob/main/Screen_Shots/bestial_spirit_missing_token.png "error message for missing token")

##### Missing Parameters

The Bestial Spirit character sheet will not update if not all of the parameters were provided.

![missing-arguments](https://github.com/Dave864/Roll20_API_Scripts/blob/main/Screen_Shots/bestial_spirit_missing_arguments.png "error message for missing arguments")

##### Too Many Parameters

The Bestial Spirit character sheet will not update if more than three parameters were provided.

![too-many-arguments](https://github.com/Dave864/Roll20_API_Scripts/blob/main/Screen_Shots/bestial_spirit_too_many_arguments.png "error message for too many arguments")

##### Invalid Parameters

The Bestial Spirit character sheet will not update if any of the given parameters do not match the expected type.

![invalid-arguments](https://github.com/Dave864/Roll20_API_Scripts/blob/main/Screen_Shots/bestial_spirit_invalid_arguments.png "error message for invalid arguments")

## Known Issues

- API will not recognize if a token present on a map is changed to represent the Bestial Spirit character sheet.
- If there is no character sheet with the phrase "Bestial Spirit" in its name, the API will fail.
- If any character sheet has the phrase "Bestial Spirit" in its name, the API will try to update that character sheet.
	- If the character sheet is not an NPC with actions named "Maul" and "Multiattack" the API will fail and stop all other APIs attached to the campaign.
- Having multiple tokens on the map that represent the same Bestial Spirit character will result in unusual behavior.
	- If one of the tokens is removed from the map the API will register that the Bestial Spirit has been removed from the board; the API command will think that no tokens representing the Bestial Spirit are present.
- This API is only designed for D&D 5e campaigns.

# License

All of the code of the API scripts in this repository is released under the MIT license (see [LICENSE](https://github.com/Roll20/roll20-api-scripts/blob/master/LICENSE) for details). If you contribute a new script or help improve an existing script, you agree that your contribution is released under the MIT License as well.
