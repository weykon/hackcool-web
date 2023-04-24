import ReactFlow, { Controls, addEdge, useNodesState, NodeAddChange, Background, applyNodeChanges, useNodes, useEdges, Edge, useEdgesState, useOnSelectionChange, useStore, useReactFlow, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import Unit, { addUnit } from './unit';
import { LoginNode, openLogin } from './login';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useUser } from '@/utils/useUser';
import CanvasComponent from '../canvas/radar';
export const nodeTypes = {
    unit: Unit,
    login_node: LoginNode
};
const initialEdges: any[] = [];
const initialNodes: any[] = []
function Flow() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { addNodes } = useReactFlow();
    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const supabaseClient = useSupabaseClient()
    const { user } = useUser()
    useEffect(() => {
        async function loadData() {
            const { data } = await supabaseClient.from('hackcool_users').select('*')
            console.log('data :', data);
            setNodes([addUnit({
                id: 'node-1', type: 'unit', data: {
                    Props: { type: "Computer", theme: 'outline', size: '60', fill: '#333' }
                },
                position: {
                    x: 100,
                    y: 100
                }
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
    }, [user])


    return (
        <div style={{ height: '100%' }}>
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
                onlyRenderVisibleElements
            >
                <Background />
            </ReactFlow>
        </div>
    );
}

export default Flow;

