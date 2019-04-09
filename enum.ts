// export const ApiUrl= 'ws://localhost:3333'
export const ApiUrl= 'wss://services.cryptomnesic.com:3333'
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
export const FourCoordinates = {
    RIGHT:{x:1,y:0},
    LEFT: {x:-1,y:0},
    DOWN: {x:0,y:1},
    UP: {x:0,y:-1}
}
export const FourCoordinatesArray = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]
export const EightCoordinatesArray = [{x:1,y:0},{x:1,y:1},{x:-1,y:0},{x:-1,y:-1},{x:0,y:1},{x:-1, y:1},{x:0,y:-1},{x:-1,y:0}]
    
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
    RIVER: ['p','q','r','s','t','u'],
    GRASS: ['']
}
export const EmptyTile = {
    x: 0,
    y: 0,
    type: TileType.GRASS,
    subType: null as null,
    unit: null as null
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
            descriptions: ['Ranged specialist that does area damage.'],
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
            descriptions: ['Army regular. Has a chance to block attacks.'],
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
            descriptions: ['Elite mercenary. Can use CHARGE to increase movement.'],
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
            descriptions: ['Gunpowder rifle gives this specialist very long range'],
            ability: null as null,
            abilityCooldown: 0,
            trait: null as null,
            cost: 5,
            level: 1,
            range: 5,
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
            descriptions: ['Plentiful bodies of the dead. Can cross rivers.'],
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
            descriptions: ['Floating lights of the forest. May move over any terrain.'],
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
            descriptions: ['A fast and vicious flanker. Can cross rivers.'],
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
            descriptions: ['Eight foot tall monstrosity. Will fall apart if it recieves too much damage at once.'],
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

export const StagingArea = [ 
    [
        {type:TileType.GRASS}, 
        {type:TileType.GRASS},
        {type:TileType.GRASS}
    ],
    [
        {type:TileType.GRASS}, 
        {type:TileType.GRASS},
        {type:TileType.GRASS}
    ],
    [
        {type:TileType.GRASS}, 
        {type:TileType.GRASS},
        {type:TileType.GRASS}
    ],
    [
        {type:TileType.GRASS}, 
        {type:TileType.GRASS},
        {type:TileType.GRASS}
    ],
    [
        {type:TileType.GRASS}, 
        {type:TileType.GRASS},
        {type:TileType.GRASS}
    ],
    [
        {type:TileType.GRASS}, 
        {type:TileType.GRASS},
        {type:TileType.GRASS}
    ],
    [
        {type:TileType.GRASS}, 
        {type:TileType.GRASS},
        {type:TileType.GRASS}
    ],
]