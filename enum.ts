export enum Abilities {CHARGE='CHARGE'}
export enum Traits {BLOCK='BLOCK', FLOAT='FLOAT', WATERBREATH='WATERBREATH', FIRESHOCK='FIRESHOCK'}
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
export enum Army {
    LIVING='LIVING',
    DEAD='DEAD'
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
export const Units = {
    [Army.LIVING]: [
        {
            name: 'Alchemist',
            atk: 2,
            hp: 2,
            maxHp: 2,
            move: 1,
            maxMove: 1,
            type: UnitType.ALCHEMIST,
            rune: 'a',
            descriptions: ['alchemist description 1', 'alchemist description 2'],
            ability: null as null,
            trait: Traits.FIRESHOCK,
            cost: 4,
            level: 1
        },
        {
            name: 'Regular',
            atk: 1,
            hp: 3,
            maxHp: 3,
            move: 2,
            maxMove: 2,
            type: UnitType.REGULAR,
            rune: 'b',
            descriptions: ['regular description 1', 'regular description 2'],
            ability: null,
            trait: Traits.BLOCK,
            cost: 4,
            level: 1
        }
    ],
    [Army.DEAD]: [
        {
            name: 'Risen',
            atk: 1,
            hp: 2,
            maxHp: 2,
            move: 1,
            maxMove: 1,
            type: UnitType.RISEN,
            rune: 'f',
            descriptions: ['risen description 1', 'risen description 2'],
            ability: null as null,
            trait: Traits.WATERBREATH,
            cost: 1,
            level: 1
        }
    ]

}