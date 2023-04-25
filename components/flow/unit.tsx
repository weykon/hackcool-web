import type { IIconAllProps } from '@icon-park/react/es/all';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { Handle, Position, useNodes, useNodesState, useOnSelectionChange, UseOnSelectionChangeOptions, useReactFlow, useStore, useStoreApi } from 'reactflow';
import CanvasComponent from '../canvas/radar';
const Icon = dynamic(() => import('@icon-park/react/es/all'), { ssr: false });

function Unit({ id, data }: UnitEnter) {
    return (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <Handle type="target" position={Position.Top} />
            <div>
                <Icon {...data.Props} />
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
            {data.SubComp && <data.SubComp />}
        </div>
    );
}

export default Unit;

export type UnitEnter = {
    id: string
    data: {
        Props: IIconAllProps
        SubComp?: () => JSX.Element
    }
}

export function addUnit(props: AddNodeParams) {
    return {
        id: props.id,
        data: props.data,
        position: props.position,
        type: props.type,
    }
}

export type AddNodeParams = {
    id: string;
    position: { x: number, y: number };
    data: UnitEnter['data']
    type: string;
}