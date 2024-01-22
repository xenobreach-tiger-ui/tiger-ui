/*
** ref: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers
*/
export type RemoveAllRequirement<Type> = {
  [Property in keyof Type]+?: Type[Property];
} | {
  [key: string]: any;
};

export type RemoveRequirement<Type> = {
  [Property in keyof Type]+?: Type[Property];
};