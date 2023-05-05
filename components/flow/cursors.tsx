import { useRealTime } from "@/utils/realtime";
import { useUser } from "@/utils/useUser";
import { read } from "fs";
import { useViewport } from "reactflow";

function Cursors() {
    const realtime = useRealTime();
    const screenPos = useViewport();

    return (
        <div style={{ position: 'absolute', right: 0, top: '-5vh', left: 0, pointerEvents: 'none' }}>
            {Object.keys(realtime.cursor_poses).map((e, idx) => {
                return (
                    <div
                        className="transition-all duration-200 ease-in-out transition"
                        key={e}
                        style={{
                            position: 'absolute', width: 20, height: 20, borderRadius: '50%',
                            backgroundColor: 'green',
                            transform: `translateX(${realtime.cursor_poses[e as any].x}px) translateY(${realtime.cursor_poses[e as any].y}px)`
                        }}>
                        <div style={{ position: 'absolute', left: 20, top: -2, textAlign: 'start' }}>weykon</div>
                    </div>
                )
            })}
        </div >
    )
}


export default Cursors;