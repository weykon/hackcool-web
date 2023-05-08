import { addUnit } from "../unit"

const FirstNode = () => {
    return addUnit({
        id: 'node-1', type: 'unit', data: {
            Props: { type: "NewComputer", theme: 'outline', size: '200', fill: '#333' },
        },
        position: {
            x: 100,
            y: 100
        },
    })
}

export default FirstNode