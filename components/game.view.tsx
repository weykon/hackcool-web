
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/react'
import { Home } from '@icon-park/react';
import '@icon-park/react/styles/index.css';
import { ReactFlowProvider } from 'reactflow';
import Flow from "./flow/flow";
import { ModalsProvider } from './flow/modal/modals';

const IconConfig = { ...DEFAULT_ICON_CONFIGS, prefix: 'icon' }


const Gameview = () => {

    return (
        <IconProvider value={IconConfig}>
            <ModalsProvider>
                <div style={{ width: '100vw', height: '100vh' }}>
                    <Flow />
                </div>
            </ModalsProvider>
        </IconProvider>
    )
}


export default Gameview