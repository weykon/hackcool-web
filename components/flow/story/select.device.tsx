import React, { Dispatch, SetStateAction } from 'react';
import { Node, useReactFlow } from 'reactflow';
import { addModal, AddModalProps } from '../modal/modals';
import { addUnit } from '../unit';
import { DeviceDescription } from './first.modal';



export const SelectDevice = (
    setNodes: Dispatch<SetStateAction<Node<any, string | undefined>[]>>,
    setModals: Dispatch<SetStateAction<AddModalProps[]>>,
) => {

    setNodes([
        addUnit({
            id: 'node-1',
            type: 'unit',
            data: {
                Props: {
                    type: "NewComputer",
                    theme: 'outline',
                    size: '200',
                    fill: '#333'
                },
            },
            position: {
                x: 100,
                y: 100
            },
        }),
        addUnit({
            id: 'node-2',
            type: 'unit',
            data: {
                Props: {
                    type: "laptop",
                    theme: 'outline',
                    size: '200',
                    fill: '#333'
                },
            },
            position: {
                x: 500,
                y: 100
            },
        }),
        addUnit({
            id: 'node-3',
            type: 'unit',
            data: {
                Props: {
                    type: "iphone",
                    theme: 'outline',
                    size: '200',
                    fill: '#333'
                },
            },
            position: {
                x: 900,
                y: 100
            },
        })
    ])

    setModals([
        addModal(
            {
                h: 300,
                w: 200,
                id: 'modal-1',
                pos: { x: 300, y: 50 },
                name: 'first-moadl',
                comp: <DeviceDescription />
            }
        ),
        addModal(
            {
                h: 300,
                w: 200,
                id: 'modal-2',
                pos: { x: 700, y: 50 },
                name: 'first-moadl',
                comp: <DeviceDescription />
            }
        ),
        addModal(
            {
                h: 300,
                w: 200,
                id: 'modal-3',
                pos: { x: 1100, y: 50 },
                name: 'first-moadl',
                comp: <DeviceDescription />
            }
        )
    ])

}

