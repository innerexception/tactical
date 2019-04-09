import * as React from 'react';
import AppStyles from '../AppStyles';
import { TopBar } from './Shared';
import { EmptyTile, TileSubType, TileType } from '../../enum'
import { LightButton, Button } from './Shared'
import { getRandomInt } from './Util'

export default class Editor extends React.Component {

    state = { 
        map: [[EmptyTile]],
        selectedTile: EmptyTile
    }

    exportMapJson = () => {
        console.log(JSON.stringify(this.state.map))
    }

    setTileType = (type:TileType) => {
        let newTile = {
            ...this.state.selectedTile,
            type,
            subType: (TileSubType as any)[type][getRandomInt((TileSubType as any)[type].length)]
        }
        this.state.map[this.state.selectedTile.x][this.state.selectedTile.y] = newTile
        this.setState({map: this.state.map, selectedTile:newTile})
    }

    setMapWidth = (w:number) => {
        let map = new Array(w).fill([])
        this.setState({map})
    }

    setMapHeight = (h: number) => {
        let map = this.state.map.map((row, x) => new Array(h).fill({...EmptyTile, x}))
        map = map.map((row, x) => row.map((tile, y) => {return {...tile, y}}))
        this.setState({map})
    }

    render(){
        return (
            <div style={{...AppStyles.window, padding:'0.5em', maxWidth:'25em'}}>
                {TopBar('Editor')}
                <div>
                    W: <input type='number' value={this.state.map.length} onChange={(e)=>this.setMapWidth(+e.currentTarget.value)}/>
                    H: <input type='number' value={this.state.map[0].length} onChange={(e)=>this.setMapHeight(+e.currentTarget.value)}/>
                </div>
                <div style={styles.tileInfo}>
                    <h4>{this.state.selectedTile.type} {this.state.selectedTile.x}, {this.state.selectedTile.y}</h4>
                    <div>
                        {Object.keys(TileType).map((key:TileType) => LightButton(true, ()=>this.setTileType(key), key))}
                    </div>
                </div>
                <div style={styles.mapFrame}>
                    <div style={{display:'flex'}}>
                        {this.state.map.map((row) => 
                            <div>
                                {row.map((tile:Tile) => 
                                    <div style={{
                                            ...styles.tile, 
                                            background: 'transparent',
                                            borderStyle: isSelectedTile(tile, this.state.selectedTile) ? 'dashed' : 'dotted'
                                        }} 
                                        onClick={()=>this.setState({selectedTile: tile})}> 
                                        <div style={{fontFamily:'Terrain', color: AppStyles.colors.grey3, fontSize:'2em'}}>{tile.subType}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {Button(true, this.exportMapJson, 'Export')}
            </div>
        )
    }
}

const isSelectedTile = (tile:Tile, selectedTile?:Tile) => {
    if(selectedTile){
        return tile.x === selectedTile.x && tile.y === selectedTile.y
    }
    return false
}

const styles = {
    mapFrame: {
        position:'relative' as 'relative',
        backgroundImage: 'url('+require('../assets/whiteTile.png')+')',
        backgroundRepeat: 'repeat',
        overflow:'auto',
        maxHeight:'60vh',
        maxWidth:'100%'
    },
    tileInfo: {
        height: '5em',
        backgroundImage: 'url('+require('../assets/whiteTile.png')+')',
        backgroundRepeat: 'repeat',
        marginBottom: '0.5em',
        padding: '0.5em',
        border: '1px dotted',
        display:'flex',
        justifyContent:'space-between'
    },
    tile: {
        width: '2em',
        height:'2em',
        border: '1px',
        position:'relative' as 'relative'
    },
}