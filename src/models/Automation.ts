import { Trigger } from './Trigger.js';
import { Action } from './Action.js';
import { apiServices } from '../services/ApiService.js';

export class Automation {
  name: string;
  trigger: Trigger;
  actions: Action[];

  constructor(name: string, trigger: Trigger, actions: Action[] = []) {
    this.name = name;
    this.trigger = trigger;
    this.actions = actions;
  }

  setName(name: string): void {
    this.name = name;
  }

  addTrigger(trigger: Trigger): void {
    this.trigger = trigger;
  }

  addAction(action: Action): void {
    this.actions.push(action);
  }

  toJSON() {
    return {
      name: this.name,
      trigger: this.trigger.toJSON(),
      actions: this.actions.map(action => action.toJSON()),
    };
  }

  async save() {
    return apiServices.post('/workflows', this.toJSON());
  }
}