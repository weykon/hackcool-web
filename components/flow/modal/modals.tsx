import React from 'react'
import { useViewport, XYPosition } from 'reactflow';

type ModalsContextType = {
    modals: AddModalProps[],
    setModals: React.Dispatch<React.SetStateAction<AddModalProps[]>>
}
const ModalsContext = React.createContext<ModalsContextType | undefined>(undefined)

export const useModals = () => {
    const context = React.useContext(ModalsContext)
    if (context === undefined) {
        throw new Error('useModals must be used within a ModalsProvider')
    }
    return context
}
interface Props {
    [propName: string]: any;
}

export const ModalsProvider = (props: Props) => {
    const [modals, setModals] = React.useState<AddModalProps[]>([])
    const value = {
        modals,
        setModals
    }
    return <ModalsContext.Provider value={value} {...props} />
}

export const Modals = () => {
    const { modals } = useModals()
    const { x, y, zoom } = useViewport();
    return (
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, left: 0, pointerEvents: 'none' }}>
            {
                modals.map(e => {
                    const _x = (e.pos.x * zoom + x)
                    const _y = (e.pos.y * zoom + y)
                    return (
                        <div
                            key={e.id}
                            className="transition-all duration-75 ease-in-out transition"
                            style={{
                                position: 'absolute',
                                width: e.w * zoom,
                                height: e.h * zoom,
                                transform: `translateX(${_x}px) translateY(${_y}px)`,
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                            }}>
                            {e.comp}
                        </div>
                    )
                })
            }
        </div>
    )
}

export const addModal = (modal: AddModalProps) => {
    return modal
}

export type AddModalProps = {
    id: string,
    name: string,
    w: number, h: number,
    pos: XYPosition,
    comp: JSX.Element
}

