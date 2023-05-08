import ReactFlow, { Controls, addEdge, useNodesState, NodeAddChange, Background, applyNodeChanges, useNodes, useEdges, Edge, useEdgesState, useOnSelectionChange, useStore, useReactFlow, ReactFlowProvider, Panel, useViewport } from 'reactflow';
import 'reactflow/dist/style.css';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Unit, { addUnit } from './unit';
import LoginNode, { openLogin } from './login';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useUser } from '@/utils/useUser';
import CanvasComponent from '../canvas/radar';
import ToolPanel from './tool.panel';
import Cursors from './cursors';
import { useRealTime } from '@/utils/realtime';
import CursorNode from './cursor';
import FirstNode from './story/first.node';

export const nodeTypes: any = {
    unit: Unit,
    login_node: LoginNode,
    user_cursor: CursorNode,
};
const initialEdges: any[] = [];
const initialNodes: any[] = [];

const FlowWrapperContext = createContext<undefined>(undefined)
export function useFlowWrapperContext() {
    const context = useContext(FlowWrapperContext)
    if (context === undefined) {
        throw new Error('useFlowWrapperContext must be used within a RealTimeProvider')
    }
    return context
}

function Flow() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const { addNodes } = useReactFlow();
    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const supabaseClient = useSupabaseClient()
    const { user, isLoading } = useUser()
    useEffect(() => {
        async function loadData() {
            if (isLoading) {
                setNodes([])
                return
            }

            setNodes([
                FirstNode()
            ])
        }

        if (user) loadData()
        else setNodes(
            [...nodes,
            addUnit({
                id: 'node-1', type: 'unit',
                data: {
                    Props: {
                        type: "Login", theme: 'outline', size: '60', fill: '#333',
                        onClick: () => {
                            console.log('clicked')
                            openLogin(addNodes)
                        }
                    }
                },
                position: { x: 200, y: 250 }
            }),
            ]
        );
    }, [user, isLoading])

    const { cursor_poses, setCursorPoses, setMouseEvent, getFlowWrapperRef } = useRealTime();
    const flowWrapperRef = useRef(null);

    useEffect(() => { getFlowWrapperRef.current = () => flowWrapperRef }, [flowWrapperRef])
    return (
        <div style={{ height: '100%', position: 'relative' }}
            ref={flowWrapperRef}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(evt, element) => {
                    if (element?.data?.onClick) element.data.onClick()
                }}
                panOnScroll
                zoomOnPinch
                nodesDraggable={false}
                onMouseMove={(evt) => {
                    if (user) {
                        // console.log(evt)
                        setMouseEvent.current(evt)
                    }
                }}
                onlyRenderVisibleElements
            >
                <Background />
                <Panel position="bottom-center" style={{ bottom: 10 }}>
                    <ToolPanel />
                </Panel>
            </ReactFlow>
            <Cursors />
        </div>
    );
}

export default Flow;

