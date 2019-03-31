export enum Abilities {CHARGE='CHARGE'}
export enum Traits {BLOCK='BLOCK', FLOAT='FLOAT', WATERBREATH='WATERBREATH'}
export enum UnitType {
    REGULAR='REGULAR',
    IMMORTAL='IMMORTAL',
    MARKSMAN='MARKSMAN',
    ALCHEMIST='ALCHEMIST',
    RISEN='RISEN',
    WISP='WISP',
    GARGANTUAN='GARGANTUAN',
    GOUL='GOUL'
}
export enum MatchStatus {ACTIVE='ACTIVE',WIN='WIN',LOSE='LOSE', SETUP='SETUP'}
export enum Directions {LEFT='LEFT', RIGHT='RIGHT', UP='UP', DOWN='DOWN'}
export enum TileType {
    MOUNTAIN='MOUNTAIN',
    FOREST='FOREST',
    RIVER='RIVER',
    HILL='HILL',
    GRASS='GRASS'
}
export const TileSubType = {
    MOUNTAIN: ['a','h','i','j','k','g'],
    HILL: ['l','m','n','o'],
    FOREST: ['b','c','d','e','f'],
    RIVER: ['p','q','r','s','t','u']
}