import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, createClient, RealtimeChannel, REALTIME_LISTEN_TYPES, REALTIME_PRESENCE_LISTEN_EVENTS, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { createContext, Dispatch, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useUser } from './useUser';
import { nanoid } from 'nanoid';
import { cloneDeep, throttle } from 'lodash';
import { useReactFlow, useViewport } from 'reactflow';

const RealTimeContext = createContext<undefined | RealTimeContextType>(undefined)
export const useRealTime = () => {
    const context = useContext(RealTimeContext)
    if (context === undefined) {
        throw new Error('useRealTime must be used within a RealTimeProvider')
    }
    return context
}

export interface Props {
    [propName: string]: any;
}
type PosUser = {
    user_id: string,
    x: number, y: number
}

const userId = nanoid();
const X_THRESHOLD = 25
const Y_THRESHOLD = 35
const RealTimeContextProvider = (props: Props) => {
    const [cursor_poses, setCursorPoses] = useState<{
        [k in string]: PosUser
    }>({})
    const { user } = useUser()
    const supabase = useSupabaseClient()
    const flowInstance = useReactFlow()
    supabase.realtime.heartbeatIntervalMs = 1000;

    const [roomId, setRoomId] = useState<string | undefined>(undefined);
    const [isInitialStateSynced, setIsInitialStateSynced] = useState<boolean>(false)
    let setMouseEvent = useRef<any>(() => { });
    let getFlowWrapperRef = useRef<any>(() => { });
    const viewport = useViewport();
    useEffect(() => {
        const channel = supabase.channel('rooms');

        channel.on(REALTIME_LISTEN_TYPES.PRESENCE, {
            event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC,
        }, () => {
            console.log('sync');
            const state = channel.presenceState();
            setIsInitialStateSynced(true)
            console.log(state);
            setRoomId('room-1');
        })

        const posChannel = supabase.channel(`poses:room-1`)
        posChannel.on(REALTIME_LISTEN_TYPES.BROADCAST,
            { event: 'POS' },
            (payload: any) => {
                const id = payload.payload.user_id
                const reactFlowBounds = getFlowWrapperRef.current().current.getBoundingClientRect();
                setCursorPoses((poses) => {
                    const exist_user = poses[id];
                    if (exist_user) {
                        const x = payload?.payload?.x
                        const y = payload?.payload?.y
                        poses[id] = {
                            ...exist_user, x, y
                        }
                        poses = cloneDeep(poses)
                    } else {
                        poses[id] = {
                            user_id: id,
                            x: payload?.payload?.x,
                            y: payload?.payload?.y
                        };
                    }
                    return poses
                })

            }
        )
        posChannel.subscribe(
            (status: `${REALTIME_SUBSCRIBE_STATES}`) => {
                if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
                    const sendPosBc = throttle(({ x, y }) => {
                        const reactFlowBounds = getFlowWrapperRef.current().current.getBoundingClientRect();
                        console.log('send', flowInstance.project({
                            x: x - reactFlowBounds.left - viewport.x,
                            y: y - reactFlowBounds.top - viewport.y
                        }), x, y, reactFlowBounds.left, viewport.x, viewport.zoom);
                        const flowPos = flowInstance.project({
                            x: x - reactFlowBounds.left,
                            y: y - reactFlowBounds.top
                        });

                        posChannel
                            .send({
                                type: 'broadcast',
                                event: 'POS',
                                payload: {
                                    user_id: userId, ...{
                                        x: flowPos.x,
                                        y: flowPos.y
                                    }
                                }
                            })
                    }, 200);
                    setMouseEvent.current = (e: MouseEvent) => {
                        const [x, y] = [e.clientX, e.clientY]
                        sendPosBc({ x, y })
                    }
                }
            }
        )

        return () => {

        }
    }, [isInitialStateSynced, viewport])


    const value = {
        cursor_poses,
        setCursorPoses,
        setMouseEvent,
        getFlowWrapperRef
    };

    return <RealTimeContext.Provider value={value} {...props} />;
}

type RealTimeContextType = {
    cursor_poses: any,
    setCursorPoses: Dispatch<any>,
    setMouseEvent: any,
    getFlowWrapperRef: any
}

export default RealTimeContextProvider
