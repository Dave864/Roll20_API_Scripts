/*
Summon Beast API Script

Command:
!summon_beast <beast type> <level> <spell attack bonus>
*/
"use strict";

// Constant describing what is sending chat messages related to this API
const SPEAKER = "Summon Beast API";

let bestial_spirit_id = null;


/*
Describes the changeable values of the Bestial Spirit creature that is created by the Summon Beast spell.
Does not include the challenge rating.
*/
class BestialSpiritMutables {
	/*
	The constructor for the mutables.
	:param type: The type of beast being summoned; defaults to "land"
	:param sl: The level the Summon Beast spell is being cast at; defaults to 2
	:param sab: The spell attack bonus of the caster; defaults to 2
	*/
	constructor(type = 'land', sl = 2, sab = 2) {
		// Initialize the mutable variables
		this.type = "";
		this.ac = 0;
		this.hp = 0;
		this.speed = "";
		this.multiattack = "";
		this.hit_bonus = 0;
		this.damage_formula = "";

		this.updateValues(type, Number(sl), Number(sab));
	}

	/*
	Changes the mutable values based off of the provided type, spell level, and spell attack bonus.
	:param type: The type of beast being summoned; defaults to "land"
	:param sl: The level the Summon Beast spell is being cast at; defaults to 2
	:param sab: The spell attack bonus of the caster; defaults to 2
	*/
	updateValues(type = 'land', sl = 2, sab = 2) {
		sl = this._boundedSpellLevel(sl);

		this._determineType(type);
		this._calculateAC(sl);
		this._calculateHP(sl);
		this._determineSpeed();
		this._determineMultiattack(sl);
		this._setHitBonus(sab);
		this._determineDamageFormula(sl);
	}

	/*
	Determines the bounded value of the provided spell level, which is a number from 2 to 9.
	The Summon Beast spell can only be cast using spell slots of level 2 or higher.
	:param sl: The level the Summon Beast spell is being cast at
	:return: The bounded value of the spell level
	*/
	_boundedSpellLevel(sl) {
		let bounded_sl = sl;

		if (bounded_sl < 2) {
			bounded_sl = 2;
		} else if (bounded_sl > 9) {
			bounded_sl = 9;
		}

		return bounded_sl;
	}

	/*
	Determines the beast type based on the value provided.
	The beast type can be either "land", "air", or "water".
	Defaults to "land" if the provided value is not accounted for.
	:param type_provided: The provided type 
	*/
	_determineType(type_provided) {
		// Defines words that are associated with the beast type
		const land_values = ["land", "earth", "ground", "walking", "walker"];
		const air_values = ["air", "sky", "wind", "airborne", "flying", "flyer"];
		const water_values = ["water", "ocean", "sea", "aquatic", "swimming", "swimmer"];

		let type = type_provided.toLowerCase();

		if (_.contains(land_values, type)) {
			this.type = "land";
		} else if (_.contains(air_values, type)) {
			this.type = "air";
		} else if (_.contains(water_values, type)) {
			this.type = "water";
		} else {
			this.type = "land";
		}
	}

	/*
	Calculates the AC based off of spell level.
	:param sl: The level the Summon Beast spell is being cast at
	*/
	_calculateAC(sl) {
		this.ac = 11 + sl;
	}

	/*
	Calculates the HP based off of spell level and beast type.
	:param sl: The level the Summon Beast spell is being cast at
	*/
	_calculateHP(sl) {
		// Defaults to land
		switch(this.type) {
			case "land":
			case "water":
				this.hp = 30;
				break;
			case "air":
				this.hp = 20;
				break;
			default:
				this.hp = 30;
		}

		this.hp += 5 * sl;
	}

	/*
	Determines the speed based off the beast type
	*/
	_determineSpeed() {
		this.speed = "30 ft.; "

		// Defaults to land
		switch(this.type) {
			case "land":
				this.speed += "climb 30 ft.";
				break;
			case "air":
				this.speed += "fly 60 ft.";
				break;
			case "water":
				this.speed += "swim 30 ft.";
				break;
			default:
				this.speed += "climb 30 ft.";
		}
	}

	/*
	Sets the multiattack description with the appropriate number of attacks.
	:param sl: The level the Summon Beast spell is being cast at
	*/
	_determineMultiattack(sl) {
		let attack_count = Math.floor(sl / 2);

		this.multiattack = attack_count > 1 
			? "The beast makes " + attack_count + " attacks."
			: "The beast makes " + attack_count + " attack.";
	}

	/*
	Sets the value of the hit bonus for the Maul attack.
	:param sab: The spell attack bonus of the caster
	*/
	_setHitBonus(sab) {
		this.hit_bonus = sab;
	}

	/*
	Sets the damage calculation formula for the Maul attack.
	:param sl: The level the Summon Beast spell is being cast at
	*/
	_determineDamageFormula(sl) {
		this.damage_formula = "1d8+" + (4 + sl);
	}
}


/*
Describes the details an attack action in an NPC character sheet.
*/
class AttackParams {
	constructor(
		id,
		attack_damagetype = null, 
		attack_range = null, 
		attack_tohit = null, 
		attack_target = null, 
		attack_damage = null
	) {
		this.id = id;
		this.attack_damagetype = attack_damagetype;
		this.attack_range = attack_range;
		this.attack_tohit = attack_tohit;
		this.attack_target = attack_target;
		this.attack_damage = attack_damage;
	}
}


/*
Describes an Action in an NPC character sheet.
*/
class Action {
	constructor(
		id, 
		name = null, 
		attack_flag = null,
		description = null,
		attack_tohitrange = null,
		attack_onhit = null,
		damage_flag = null,
		attack_crit = null,
		attack_crit2 = null,
		rollbase = null
	) {
		this.id = id;
		this.name = name;
		this.attack_flag = attack_flag;
		this.attack_params = null;
		this.description = description;
		this.attack_tohitrange = attack_tohitrange;
		this.attack_onhit = attack_onhit;
		this.damage_flag = damage_flag;
		this.attack_crit = attack_crit;
		this.attack_crit2 = attack_crit2;
		this.rollbase = rollbase;
	}
}


/*
Display an error message related to the Summon Beast API to the Roll20 chat.
:param description: Error description
:param message: Message detailing the error
*/
function displayError(description, message) {
	msg = '<div style = "background-color: white; padding: 5px 10px; border: 1px solid black">'
	+ '<p style = "color: white; font-weight: bold; font-size: 110%; background-color: red; padding: 5px 10px; border: 1px solid black">'
	+ 'ERROR-' + description
	+	'</p>'
	+ message
	+ '</div>';
	
	sendChat(SPEAKER, msg);
}


/*
Display a message related to the Summon Beast API to the Roll20 chat.
:param message: Message to send to chat
*/
function displayMessage(message) {
	msg = '<div style = "background-color: white; padding: 5px 10px; border: 1px solid green">'
	+ message
	+ '</div>'
	
	sendChat(SPEAKER, msg);
}


/*
Interprets the provided Roll20 chat command and collects the provided parameters.
:param input: The command entered into chat
:return: Object containing the values of the passed in arguments; 
returns null if the entered command cannot be processed
*/
function processInput(input) {
  let command = _.clone(input), 
	beast_type, 
	spell_level, 
	spell_attack_bonus,
	input_error = false,
	error_message = "";
	
	// Ignores non-api chat inputs
	if (command.type !== "api") {
		return null;
	}
	
	let args = command.content.split(' '),
	api_command = args.shift();
	
	if (api_command === "!summon-beast") {
		if (!bestial_spirit_id) {
			error_message = '<p>'
			+ 'A token representing a Bestial Spirit must be present on the map. '
			+ 'Make sure the token references the Bestial Spirit character sheet.'
			+ '</p>';
			displayError('Token for Bestial Spirit not present', error_message);
			return null;
		}
		
		if (args.length === 3) {

			// Check the arguments to see if they are valid
			beast_type = args[0];
			if (!Number.isNaN(Number(beast_type))) {
				input_error = true;
				error_message += '<div>'
					+	'<b>Issue with first argument (beast type): ' + beast_type + '</b>'
					+ '<p style="padding-left: 5px">'
					+ 'This argument must be a word ("land", "air", "water") '
					+ 'describing the type of beast being summoned.'
					+ 'If the provided word cannot be interpreted, '
					+ 'the beast type will default to "land".'
					+ '</p>'
					+ '</div>';
			}
			
			spell_level = args[1];
			if (!Number.isSafeInteger(Number(spell_level))) {
				input_error = true;
				error_message += '<div>'
					+	'<b>Issue with second argument (spell level): ' + spell_level + '</b>'
					+ '<p style="padding-left: 5px">'
					+ 'This argument must be a number describing the level the '
					+ 'Summon Beast spell was cast at.'
					+ '</p>'
					+ '</div>';
			}
			
			spell_attack_bonus = args[2];
			if (!Number.isSafeInteger(Number(spell_attack_bonus))) {
				input_error = true;
				error_message += '<div>'
					+	'<b>Issue with third argument (spell attack bonus): ' + spell_attack_bonus + '</b>'
					+ '<p style="padding-left: 5px">'
					+ 'This argument must be a number describing the spell attack bonus '
					+ 'of the caster of the Summon Beast spell.'
					+ '</p>'
					+ '</div>';
			}
			
			if (input_error) {
				displayError('Arguments entered incorrectly!', error_message);
				return null;
			}
			
			return {
				type: beast_type,
				spell_level: Number(spell_level),
				spell_attack_bonus: Number(spell_attack_bonus)
			};
		} else if (args.length > 3) {
			error_message = '<p>'
				+ 'The summon beast API takes in 3 arguments:'
				+ '<ul>'
				+ '<li>beast type (\"land\", \"air\", \"water\")</li>'
				+ '<li>spell level</li>'
				+ '<li>spell attack bonus</li>'
				+ '</ul>'
				+ '</p>'
				
			displayError('Too many arguments provided!', error_message);
		} else {
			error_message = '<p>'
				+ 'The summon beast API takes in 3 arguments:'
				+ '<ul>'
				+ '<li>beast type (\"land\", \"air\", \"water\")</li>'
				+ '<li>spell level</li>'
				+ '<li>spell attack bonus</li>'
				+ '</ul>'
				+ '</p>'
			displayError('Not enough arguments provided!', error_message);
		}
	}
	return null;
};


/*
Update the actions associated with the Bestial Spirit
:param actions: List of actions to update
:param updated_attrs: Object containing the updated values
*/
function updateActions(actions, updated_attrs) {
	_.each(actions, function(a) {
		if (a.action.attack_params) {
			if (a.action.name.get("current") === "Maul") {
				a.attack_params.attack_damage.set("current", updated_attrs.damage_formula);
				a.attack_params.attack_tohit.set("current", updated_attrs.hit_bonus);
			}
		} else {
			if (a.action.name.get("current") === "Multiattack") {
				a.action.description.set("current", updated_attrs.multiattack);
			}
		}
	});
};


/*
Uses provided data to update the details of the Bestial Spirit character sheet 
associated with a present token.
:param params: Object with info used to determine details of the Bestial Spirit
*/
function updateBestialSpirit(params) {
	const attrs_filter = ["npc_name", "npc_ac", "hp", "npc_speed"];
	
	// Regex for getting the actions of the Bestial Spirit
	const action_regex = /repeating_npcaction_(.*?)_(.*)/;
	
	let action_param = null;
	let actions = new Object();
	
	let updated_attrs = new BestialSpiritMutables(params.type, 
		params.spell_level, 
		params.spell_attack_bonus);
	
	// Get the attributes and actions of the Bestial Spirit
	let bs_attrs = _.filter(
		findObjs({_characterid: bestial_spirit_id, _type: "attribute"}),
		function(attr){return _.contains(attrs_filter, attr.get("name")) 
			|| _.size(attr.get("name").match(action_regex)) > 0}
	);
	
	// Update the attributes
	_.each(bs_attrs, function(attr){			
		switch(attr.get("name")) {
			case "npc_name":
				attr.set("current", "Bestial Spirit (" + updated_attrs.type + ")");
				break;
			case "npc_ac":
				attr.set("current", updated_attrs.ac);
				break;
			case "hp":
				attr.set("max", updated_attrs.hp);
				attr.set("current", updated_attrs.hp);
				break;
			case "npc_speed":
				attr.set("current", updated_attrs.speed);
				break;
			default:
				// Gather the action attributes into thier own object
				action_param = action_regex.exec(attr.get("name"));
				
				if (!_.has(actions, action_param[1])) {
					// Create new action set
					actions[action_param[1]] = {
						"action": new Action(action_param[1]), 
						"attack_params": new AttackParams(action_param[1])
					};
				}
				
				if (_.has(actions[action_param[1]].attack_params, action_param[2])) {
					// Set parameter for attack
					actions[action_param[1]].attack_params[action_param[2]] = attr;
					actions[action_param[1]].action.attack_params = actions[action_param[1]].attack_params;
				} else {
					// Set parameter for action
					actions[action_param[1]].action[action_param[2]] = attr;
				}
		}
	});
	
	// Update the actions
	updateActions(actions, updated_attrs);
	
	displayMessage( '<p>'
		+ 'The bestial spirit has been set.'
		+ '</p>');
};


/*
Gets the character sheet id from the token used to represent the Bestial Spirit
:param obj: The token object
:return: id value of the reference character sheet; 
null if the character sheet is not for Bestial Spirit
*/
function getBestialSpiritId(obj) {
	let char = getObj("character", obj.get("represents"));
	if (char !== undefined 
	    && char.get("name").toLowerCase().includes("bestial spirit")) {
		return char.get("_id");
	}
	return null;
};


/*
Sets up the api to watch for newly added graphics.
*/
on("add:token", function(obj) {
	bestial_spirit_id = getBestialSpiritId(obj);
});


/*
Sets up the api to watch for destroyed graphics
*/
on("destroy:token", function(obj) {
	char_id = getBestialSpiritId(obj);
	if (char_id) {
		bestial_spirit_id = null;
	}
});


/*
Sets up the api to watch the Roll20 chat for the "summon-beast" command
*/
on("chat:message", function(input) {
	let parameters = processInput(input);
	
	if (parameters) {
		updateBestialSpirit(parameters);
	}
});