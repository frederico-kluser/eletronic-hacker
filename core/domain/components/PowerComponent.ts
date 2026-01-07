import { defineComponent, Types } from 'bitecs';

export enum PowerState {
  Off = 0,
  On = 1,
}

export const PowerComponent = defineComponent({
  value: Types.ui8,
});

export function toPowerBoolean(state: PowerState): boolean {
  return state === PowerState.On;
}
