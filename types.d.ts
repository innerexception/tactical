declare enum UnitType {
    REGULAR='REGULAR',
    IMMORTAL='IMMORTAL',
    MARKSMAN='MARKSMAN',
    ALCHEMIST='ALCHEMIST',
    RISEN='RISEN',
    WISP='WISP',
    GARGANTUAN='GARGANTUAN',
    GOUL='GOUL'
}
declare enum Directions {LEFT='LEFT', RIGHT='RIGHT', UP='UP', DOWN='DOWN'}
declare enum Abilities {CHARGE='CHARGE'}
declare enum Traits {BLOCK='BLOCK', FLOAT='FLOAT', WATERBREATH='WATERBREATH'}

declare enum MatchStatus {ACTIVE='ACTIVE',WIN='WIN',LOSE='LOSE', SETUP='SETUP'}

declare enum TileType {
    MOUNTAIN='MOUNTAIN',
    FOREST='FOREST',
    RIVER='RIVER',
    HILL='HILL',
    GRASS='GRASS'
}

interface LocalUser {
    name:string
    id:string
}

interface Unit {
    id:string
    ownerId: string
    x:number
    y:number
    atk: number
    hp: number
    maxHp: number
    move: number
    maxMove: number
    type: UnitType
    rune: string
    descriptions: Array<string>
    description: string
    ability: Abilities
    trait: Traits
    cost: number
    level: number
    range: number
    sight: number
    attacks: number
}

interface Player {
    name: string
    id: string
    isReady: boolean
    spawn: {x:number, y:number}
}

interface Tile {
    x: number
    y: number
    type: TileType
    subType: string
    unit: Unit
}

interface Session {
    sessionId: string,
    status: MatchStatus,
    activePlayerId: string,
    players: Array<Player>,
    map: Array<Array<Tile>>,
    ticks: number,
    turnTickLimit: number
}

interface RState {
    isConnected: boolean
    currentUser: LocalUser
    activeSession: Session
}