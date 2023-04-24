
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/react'
import { Home } from '@icon-park/react';
import '@icon-park/react/styles/index.css';
import { ReactFlowProvider } from 'reactflow';
import Flow from "./flow/flow";

const IconConfig = { ...DEFAULT_ICON_CONFIGS, prefix: 'icon' }


const Gameview = () => {

    return (
        <IconProvider value={IconConfig}>
            <div style={{ width: '100vw', height: '95vh' }}>
                <ReactFlowProvider>
                    <Flow />
                </ReactFlowProvider>
            </div>
        </IconProvider>
    )
}


export default Gameview