import React from 'react'
import { XYPosition } from 'reactflow';

type ModalsContextType = {
    modals: AddModalProps[]
    setModals: React.Dispatch<React.SetStateAction<AddModalProps[]>>
}
const ModalsContext = React.createContext<ModalsContextType | {}>({})

export const useModals = () => React.useContext(ModalsContext)
interface Props {
    [propName: string]: any;
}
const ModalsProvider = (props: Props) => {
    const [modals, setModals] = React.useState<AddModalProps[]>([])
    const value = {
        modals,
        setModals
    }

    return (
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, left: 0, pointerEvents: 'none' }}>
            <ModalsContext.Provider value={value} {...props} >
                {modals.map(e => {
                    return (
                        <div key={e.id} style={{ position: 'absolute', width: e.w, height: e.h, left: e.pos.x, top: e.pos.y, pointerEvents: 'all' }}>
                            {e.comp}
                        </div>
                    )
                })}
            </ModalsContext.Provider>
        </div>
    )
}

export const addModal = (modals: AddModalProps[]) => {
    return {
        modals
    }
}

type AddModalProps = {
    id: string,
    name: string,
    w: number, h: number,
    pos: XYPosition,
    comp: JSX.Element
}

export default ModalsProvider
