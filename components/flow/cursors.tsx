import { useRealTime } from "@/utils/realtime";
import { useUser } from "@/utils/useUser";
import { read } from "fs";
import { getTransformForBounds, useReactFlow, useViewport } from "reactflow";

function Cursors() {
    const realtime = useRealTime();
    const flowInstance = useReactFlow();

    const { x, y, zoom } = useViewport();
    return (
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, left: 0, pointerEvents: 'none' }}>
            {Object.keys(realtime.cursor_poses).map((e, idx) => {
                const _x = realtime.cursor_poses[e as any].x + x
                const _y = realtime.cursor_poses[e as any].y + y
                // const { x, y } = flowInstance.project({
                //     x: realtime.cursor_poses[e as any].x,
                //     y: realtime.cursor_poses[e as any].y
                // });

                return (
                    <div
                        className="transition-all duration-400 ease-in-out transition"
                        key={e}
                        style={{
                            position: 'absolute', width: 20, height: 20, borderRadius: '50%',
                            backgroundColor: 'green',
                            transform: `translateX(${_x}px) translateY(${_y}px)`
                        }}>
                        <div style={{ position: 'absolute', left: 20, top: -2, textAlign: 'start' }}>weykon</div>
                    </div>
                )
            })}
        </div >
    )
}


export default Cursors;