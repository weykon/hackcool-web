import ReactFlow, { Controls, addEdge, useNodesState, NodeAddChange, Background, applyNodeChanges, useNodes, useEdges, Edge, useEdgesState, useOnSelectionChange, useStore, useReactFlow, ReactFlowProvider, Panel, useViewport } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
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

export const nodeTypes: any = {
    unit: Unit,
    login_node: LoginNode,
    user_cursor: CursorNode,
};
const initialEdges: any[] = [];
const initialNodes: any[] = []
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
            // const { data } = await supabaseClient.from('hackcool_users').select('*')

            setNodes([
                addUnit({
                    id: 'node-1', type: 'unit', data: {
                        Props: { type: "Computer", theme: 'outline', size: '60', fill: '#333' },
                        // SubComp: () => (
                        //     <div style={{ flexDirection: 'column', borderRadius: 6, backgroundColor: '#222222', position: 'absolute', bottom: -160, width: 120, height: 150, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        //         <div style={{ width: '90%', height: '80%', backgroundColor: '#333333', borderRadius: 5 }}></div>
                        //         <input type="text" style={{ marginTop: 5, fontSize: 8, width: '90%', height: '10%', backgroundColor: '#333333', borderRadius: 5, textAlign: 'left', }} />
                        //     </div>
                        // )
                    },
                    position: {
                        x: 100,
                        y: 100
                    },
                })])
        }
        // Only run query once user is logged in.
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

    const { cursor_poses, setCursorPoses, setMouseEvent } = useRealTime()
    const screenPos = useViewport();
    return (
        <div style={{ height: '100%', position: 'relative' }}>
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
                        setMouseEvent.current(evt)
                    }
                }}
                onlyRenderVisibleElements
            >
                <Background />
                <Panel position="bottom-center" style={{ bottom: 50 }}>
                    <ToolPanel />
                </Panel>
            </ReactFlow>
            <Cursors />
        </div>
    );
}

export default Flow;

