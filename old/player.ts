import { random } from "./base";

export class Player {

    resources = {};
    objects = {};
    rule = { objects: { need: {} } };

    constructor(
        private index: number,
        private ai: boolean
    ) { }

    public static create(game, count) {
        const pc_index = random(0, count - 1);
        const players = [];

        for (const i=0; i<count; i++)
        {
            players.push(new Player({
                index: i,
                ai: i !== pc_index,
                game
            }));
        }

        return players;
    }

    getRoundMessage() {
        return this.ai ? `Ходит игрок №${this.index + 1}` : 'Ваш ход';
    }

    getMessageTimeout() {
        return this.ai ? 1000 : 300;
    }

    AddObject(name) {
        this.objects[name] = (this.objects[name] || 0) + 1;
        this.rule.objects[name].count--;

        if (this.rule.objects[name].count <= 0) {
            delete this.rule.objects[name];
            this.game.toggleObjectDescription(name, false);
            this.game.hideHoverTable(name);
        }
    }

    hasObject(type) {
        if (!type) return false;
        return Object.keys(this.objects).includes(type);
    }

    Step(rule) {
        this.rule = rule || this.rule;

        if (this.ai) {
            /*if (rule.objects) {
                this.game.setRandomObject(rule.objects);
            }*/
        }
        else{
            if (this.rule.objects) {
                const result = {};

                for (const name in this.rule.objects) {
                    const obj = this.rule.objects[name];

                    if (obj.need) {
                        if (this.hasObject(obj.need)) {
                            result[name] = 1;
                        }
                        this.game.setFilter(name);
                    }
                    else{
                        result[name] = 1;
                    }
                }

                this.game.toggleObjectDescription(result, true);
            }
        }
    }
}
