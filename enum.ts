export const ApiUrl= 'ws://localhost:1337'
export const ReducerActions= {
    PLAYER_AVAILABLE: 'ma',
    MATCH_UPDATE: 'mu',
    MATCH_TICK: 'mt',
    PLAYER_READY: 'pr',
    PLAYER_ENTERED: 'pe',
    PLAYER_JOIN: 'pj',
    PLAYER_LEFT: 'pl',
    NEW_PHRASE: 'np',
    MATCH_START: 'ms',
    MATCH_WIN: 'mw',
    MATCH_LOST: 'ml',
    MATCH_CLEANUP: 'mc',
    PHRASE_CORRECT: 'pc',
    TIMER_TICK:'tt',
    INIT_SERVER: 'is',
    CONNECTION_ERROR: 'ce',
    CONNECTED: 'c',
    SET_USER: 'su'
}
export enum Abilities {CHARGE='CHARGE'}
export enum Traits {BLOCK='BLOCK', FLOAT='FLOAT', WATERBREATH='WATERBREATH', FIRESHOCK='FIRESHOCK', BRITTLE='BRITTLE'}
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
            abilityCooldown: 0,
            trait: Traits.FIRESHOCK,
            cost: 4,
            level: 1,
            range: 2,
            sight: 2,
            attacks: 1,
            maxAttacks: 1
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
            ability: null as null,
            abilityCooldown: 0,
            trait: Traits.BLOCK,
            cost: 4,
            level: 1,
            range: 1,
            sight: 2,
            attacks: 1,
            maxAttacks: 1
        },
        {
            name: 'Immortal',
            atk: 3,
            hp: 3,
            maxHp: 4,
            move: 2,
            maxMove: 2,
            type: UnitType.IMMORTAL,
            rune: 'c',
            descriptions: ['regular description 1', 'regular description 2'],
            ability: Abilities.CHARGE,
            abilityCooldown: 0,
            trait: null as null,
            cost: 6,
            level: 1,
            range: 1,
            sight: 2,
            attacks: 1,
            maxAttacks: 1
        },
        {
            name: 'Marksman',
            atk: 1,
            hp: 2,
            maxHp: 2,
            move: 1,
            maxMove: 1,
            type: UnitType.MARKSMAN,
            rune: 'd',
            descriptions: ['regular description 1', 'regular description 2'],
            ability: null as null,
            abilityCooldown: 0,
            trait: null as null,
            cost: 5,
            level: 1,
            range: 4,
            sight: 2,
            attacks: 1,
            maxAttacks: 1
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
            abilityCooldown: 0,
            trait: Traits.WATERBREATH,
            cost: 1,
            level: 1,
            range: 1,
            sight: 1,
            attacks: 1,
            maxAttacks: 1
        },
        {
            name: 'Wisp',
            atk: 1,
            hp: 1,
            maxHp: 1,
            move: 2,
            maxMove: 2,
            type: UnitType.WISP,
            rune: 'g',
            descriptions: ['risen description 1', 'risen description 2'],
            ability: null as null,
            abilityCooldown: 0,
            trait: Traits.FLOAT,
            cost: 3,
            level: 1,
            range: 4,
            sight: 1,
            attacks: 1,
            maxAttacks: 1
        },
        {
            name: 'Goul',
            atk: 1,
            hp: 2,
            maxHp: 2,
            move: 3,
            maxMove: 3,
            type: UnitType.GOUL,
            rune: 'h',
            descriptions: ['risen description 1', 'risen description 2'],
            ability: null as null,
            abilityCooldown: 0,
            trait: Traits.WATERBREATH,
            cost: 3,
            level: 1,
            range: 1,
            sight: 4,
            attacks: 1,
            maxAttacks: 1
        },
        {
            name: 'Gargantuan',
            atk: 2,
            hp: 10,
            maxHp: 10,
            move: 2,
            maxMove: 2,
            type: UnitType.GARGANTUAN,
            rune: 'i',
            descriptions: ['risen description 1', 'risen description 2'],
            ability: null as null,
            abilityCooldown: 0,
            trait: Traits.BRITTLE,
            cost: 10,
            level: 1,
            range: 1,
            sight: 4,
            attacks: 2,
            maxAttacks: 2
        }
    ]

}