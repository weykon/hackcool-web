import { createClient, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
})

const RealTimeContext = createContext<any>(undefined)
const useRealTime = () => {
    const context = useContext(RealTimeContext)
    if (context === undefined) {
        throw new Error('useRealTime must be used within a RealTimeProvider')
    }
    return context
}

export interface Props {
    [propName: string]: any;
}

const RealTimeContextProvider = (props: Props) => {
    const [cursor_poses, setCursorPoses] = useState<any>([])

    useEffect(() => {

        const channel = supabase.channel('room1');


        let timer: NodeJS.Timer | null = null
        channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                timer = setInterval(() => {
                    channel.send({
                        type: 'broadcast',
                        event: 'cursor-pos',
                        payload: { x: Math.random(), y: Math.random() },
                    })
                    // console.log(status)
                }, 1000)
            }
        });

        channel.on('broadcast', { event: 'cursor-pos' }, (payload: any) => {
            // console.log('payload', payload)
        })

        return () => clearInterval(timer!)
    }, [])

    const value = {
        cursor_poses
    };


    return <RealTimeContext.Provider value={value} {...props} />;
}

type RealTimeContextType = {
    cursor_poses: any[],

}

export default RealTimeContextProvider
