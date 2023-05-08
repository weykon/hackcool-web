import { useRealTime } from "@/utils/realtime";
import { useUser } from "@/utils/useUser";
import { read } from "fs";
import { getTransformForBounds, useReactFlow, useViewport } from "reactflow";

function Cursors() {
    const realtime = useRealTime();
    const { user } = useUser()
    const { x, y, zoom } = useViewport();
    return (
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, left: 0, pointerEvents: 'none' }}>
            {Object.keys(realtime.cursor_poses).map((e, idx) => {
                const _x = (realtime.cursor_poses[e as any].x * zoom + x)
                const _y = (realtime.cursor_poses[e as any].y * zoom + y)

                return (
                    <div
                        className="transition-all duration-400 ease-in-out transition"
                        key={e}
                        style={{
                            position: 'absolute',
                            transform: `translateX(${_x}px) translateY(${_y}px)`,
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                        <div style={{
                            width: 20 * zoom, height: 20 * zoom, borderRadius: '50%',
                            backgroundColor: 'green',
                        }}></div>
                        <div style={{ fontSize: 10 * zoom, textAlign: 'start' }}>{user?.user_metadata.user_name ?? 'unknown'}</div>
                    </div>
                )
            })}
        </div >
    )
}


export default Cursors;