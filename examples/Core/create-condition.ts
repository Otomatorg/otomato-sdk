import { ACTIONS, getTokenFromSymbol, CHAINS, Action, isAddress, LOGIC_OPERATORS } from '../../src/index.js';
import { ConditionGroup } from '../../src/models/conditions/ConditionGroup.js';

const createAction = () => {
  // Create condition groups and checks
  const conditionGroup1 = new ConditionGroup(LOGIC_OPERATORS.OR);
  conditionGroup1.addConditionCheck(10, 'gte', 5);
  conditionGroup1.addConditionCheck('{{nodeMap.2.output.value}}', 'gte', 18);

  const conditionGroup2 = new ConditionGroup(LOGIC_OPERATORS.AND);
  conditionGroup2.addConditionCheck(20, 'lt', 25);
  conditionGroup2.addConditionCheck('{{nodeMap.2.output.value}}', 'gte', 18);

  // Create the condition action
  const condition = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.OR);
  condition.setParams('groups', [conditionGroup1, conditionGroup2]);

  console.log(JSON.stringify(condition.toJSON(), null, 2));
};

createAction();