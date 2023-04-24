import { useEffect } from 'react';
import { useNodes, useViewport } from 'reactflow';

function CanvasComponent() {
    const nodes = useNodes();
    const { x, y, zoom } = useViewport();
    console.log(x, y, zoom)
    useEffect(() => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (canvas === null) return;
        const node = nodes.find(e => e.id === 'node-1');
        if (node === undefined) return;
        let x = node.position.x;
        let y = node.position.y;

        const ctx = canvas.getContext('2d')
        const scaleFactor = window.devicePixelRatio; // 获取屏幕像素比
        const width = window.innerWidth * scaleFactor; // 计算Canvas宽度
        const height = window.innerHeight * scaleFactor; // 计算Canvas高度

        canvas.width = width; // 设置Canvas宽度
        canvas.height = height; // 设置Canvas高度
        if (ctx === null) return;
        const centerX = 0;
        const centerY = 0;

        // 设置扫描线的起始角度
        var startAngle = 0;
        var endAngle = Math.PI / 4; // 雷达领域 - 45度角
        var radius = 100;
        // 根据扫描角度设置扫描速度
        var scanSpeed = 0.05;


        function drawCircle() {
            if (ctx === null) return;
            // 在 Canvas 中绘制圆形
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }

        function animate() {
            if (ctx === null) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除整个 Canvas

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.save();
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.stroke();
            ctx.restore();

            startAngle += scanSpeed;
            endAngle += scanSpeed;
            if (startAngle > 2 * Math.PI) {
                startAngle = 0;
                endAngle = Math.PI / 4;
            }
            requestAnimationFrame(animate);
        }

        animate();


    }, [window.innerWidth, window.innerHeight]);


    return <canvas id="canvas" style={{ width: '100%', height: '100%', }}></canvas>;
}

export default CanvasComponent;

export function createRadar() {

}