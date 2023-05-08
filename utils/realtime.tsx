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

const RealTimeContextProvider = (props: Props) => {
    const [cursor_poses, setCursorPoses] = useState<{
        [k in string]: PosUser
    }>({})
    const { user } = useUser()
    const supabase = useSupabaseClient()
    const flowInstance = useReactFlow()
    supabase.realtime.heartbeatIntervalMs = 1000;

    let setMouseEvent = useRef<any>(() => { });
    let getFlowWrapperRef = useRef<any>(() => { });

    useEffect(() => {
        if (!user) return
        const channel = supabase.channel('online_users', {
            config: { presence: { key: user.id } }
        });

        channel.on(REALTIME_LISTEN_TYPES.PRESENCE, {
            event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC,
        }, () => {
            const state = channel.presenceState()
            console.log('state', state)
        })
        channel.on(REALTIME_LISTEN_TYPES.PRESENCE, {
            event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN
        }, ({ key, newPresences }) => {
            console.log('JOIN:', key, newPresences);
            // 加入添加对应的光标
            setCursorPoses((poses) => {
                if (poses[key]) {
                    return poses
                } else {
                    return {
                        ...poses,
                        [key]: {
                            user_id: key,
                            x: 0,
                            y: 0
                        }
                    }
                }
            })
        });
        channel.on(REALTIME_LISTEN_TYPES.PRESENCE, {
            event: REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE
        }, ({ key, leftPresences }) => {
            console.log('LEAVE:', key, leftPresences)
            // 离开删除对应的光标
            setCursorPoses((poses) => {
                if (!poses[key]) {
                    return poses
                } else {
                    const newPoses = cloneDeep(poses);
                    delete newPoses[key];
                    return newPoses
                }
            })
        });

        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                const status = await channel.track({ online_at: new Date().toISOString() })
                console.log(status)
            }
        })

        const posChannel = supabase.channel(`poses:room-1`)
        posChannel.on(REALTIME_LISTEN_TYPES.BROADCAST,
            { event: 'POS' },
            (payload: any) => {
                const id = payload.payload.user_id
                setCursorPoses((poses) => {
                    const exist_user = poses[id];
                    if (exist_user) {
                        const x = payload?.payload?.x
                        const y = payload?.payload?.y
                        poses[id] = {
                            ...exist_user, x, y
                        }
                        poses = cloneDeep(poses)
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
                        const flowPos = flowInstance.project({
                            x: x - reactFlowBounds.left,
                            y: y - reactFlowBounds.top
                        });

                        posChannel
                            .send({
                                type: 'broadcast',
                                event: 'POS',
                                payload: {
                                    user_id: user.id, ...{
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
    }, [user])


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
