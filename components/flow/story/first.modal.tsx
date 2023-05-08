import { addModal } from "../modal/modals"
import React, { useEffect, useLayoutEffect } from "react"
import { useViewport } from "reactflow";
export const FirstModal = () => {
    return addModal(
        {
            h: 300,
            w: 300,
            id: 'modal-1',
            pos: { x: 300, y: 50 },
            name: 'first-moadl',
            comp: <DeviceDescription />
        }
    )
}

export function DeviceDescription() {
    const { zoom } = useViewport();
    const [zoomMove, setZoomMove] = React.useState(false);

    useLayoutEffect(() => {
        let timeoutId: NodeJS.Timeout | undefined = undefined;
        if (zoom) {
            setZoomMove(true);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                setZoomMove(false);
            }, 300);
        }
        return () => clearTimeout(timeoutId);
    }, [zoom])

    return (
        <div style={{
            border: '2px solid #44221433',
            backgroundColor: '#88991723',
            borderRadius: 20 * zoom,
            padding: 5 * zoom,
            display: 'flex',
            width: '100%',
            height: '100%',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'scroll',
            pointerEvents: 'auto',
            fontSize: 16 * zoom,
        }}>
            {
                zoomMove ?
                    <FillDiv />
                    : <>
                        <p>Mac</p>
                        <ul>
                            <li>CPU：2.8 GHz 四核Intel Core i7处理器</li>
                            <li>内存：16GB 1600MHz DDR3内存</li>
                            <li>存储：512GB PCIe闪存存储</li>
                            <li>显卡：Intel Iris Pro Graphics以及NVIDIA GeForce GT 750M（带2GB GDDR5显存）</li>
                            <li>显示屏：Retina显示屏（分辨率为2880 x 1800）</li>
                        </ul>
                    </>
            }

        </div>
    )
}

const FillDiv = () => (
    <div style={{ width: '120%', height: '150%', backgroundColor: '#777777' }} />
)