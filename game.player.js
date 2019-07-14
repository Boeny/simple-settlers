Game.prototype.Player = function(o){
	this.Init(o);
};
Game.prototype.Player.prototype = {
	Init: function(o){
		this.index = o.index;
		this.ai = o.ai;
		this.parent = o.parent

		this.resources = {};
		this.objects = {};
	},
	Create: function(parent, count){
		var pc_index = random(0, count-1);
		var players = [];

		for (var i=0; i<count; i++)
		{
			players.push(new parent.Player({
				index: i,
				ai: i !== pc_index,
				parent: parent
			}));
		}

		return players;
	},

	getRoundMessage: function(){
		return this.ai ? 'Ходит игрок №'+(this.index+1) : 'Ваш ход';
	},
	getMessageTimeout: function(){
		return 300;
	},

	AddObject: function(type, count){
		this.objects[type] = (this.objects[type] || 0) + (count || 1);

		if (this.rule.objects[type].count !== undefined){
			this.rule.objects[type].count--;

			if (this.rule.objects[type].count <= 0){
				delete this.rule.objects[type];
			}
		}
		else{
			if (this.rule.objects[type].receipt){
				for (var i in this.rule.objects[type].receipt){
					this.DelRes(i);
				}
			}
		}
	},
	DelRes: function(type){
		if (this.resources[type]) this.resources[type]--;
		if (this.resources[type] <= 0) delete this.resources[type];
	},
	AddRes: function(type, count){
		this.resources[type] = (this.resources[type] || 0) + (count || 1);
	},
	getRes: function(){
		return this.resources;
	},
	hasRes: function(receipt){
		for (var type in receipt){
			if (!this.resources[type] || this.resources[type] < receipt[type])
				return false;
		}

		return true;
	},

	getEnabled: function(){
		return obj_length(this.rule.objects) > 0;
	},
	hasObject: function(type){
		if (!type) return false;

		if (is_array(type)){
			var result = false;

			for (var i in type){
				if (this.hasObject(type[i])) return true;
			}
			return false;
		}

		return in_array(type, obj_keys(this.objects));
	},

	Step: function(r){
		this.rule = r || this.rule;

		var enabled = [];
		var filtered = [];

		if (this.ai){
			for (var type in this.rule.objects){
				var obj = this.rule.objects[type];

				if (obj.need || obj.receipt){
					if (this.hasObject(obj.need)){
						if (!obj.receipt || this.hasRes(obj.receipt)){
							enabled.push(type);
						}
					}
					filtered.push(type);
				}
				else{
					enabled.push(type);
				}
			}
		}
		else{
			for (var type in this.rule.objects){
				var obj = this.rule.objects[type];

				if (obj.need || obj.receipt){
					if (this.hasObject(obj.need)){
						if (!obj.receipt || this.hasRes(obj.receipt)){
							enabled.push(type);
						}
					}
					filtered.push(type);
				}
				else{
					enabled.push(type);
				}
			}
		}

		return {
			filtered: filtered,
			enabled: this.ai ? [] : enabled
		};
	}
};
