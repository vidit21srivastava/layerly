import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

const StlCanvas = ({
    url,
    color = '#ef4444',
    background = '#f8fafc',
    height = 400,
    initialZoom = 0.5,
    minZoom = 0.25,
    maxZoom = 3
}) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const meshRef = useRef(null);
    const frameRef = useRef(null);
    const zoomRef = useRef(initialZoom);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const w = container.clientWidth || 400;
        const h = height;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(background);

        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
        camera.position.set(0, 0, 120 / initialZoom);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(w, h);
        container.appendChild(renderer.domElement);

        // Lights
        const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9);
        hemi.position.set(0, 200, 0);
        scene.add(hemi);
        const dir = new THREE.DirectionalLight(0xffffff, 0.8);
        dir.position.set(100, 100, 100);
        scene.add(dir);

        // Ground grid
        const grid = new THREE.GridHelper(200, 20, 0xcccccc, 0xeeeeee);
        grid.position.y = -40;
        scene.add(grid);

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        // Resize
        const ro = new ResizeObserver(() => {
            const nw = container.clientWidth || 400;
            camera.aspect = nw / h;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, h);
        });
        ro.observe(container);

        // Simple drag rotate
        let down = false, sx = 0, sy = 0;
        container.addEventListener('pointerdown', e => {
            down = true;
            sx = e.clientX;
            sy = e.clientY;
        });
        container.addEventListener('pointerup', () => { down = false; });
        container.addEventListener('pointermove', e => {
            if (!down || !meshRef.current) return;
            const dx = (e.clientX - sx) * 0.01;
            const dy = (e.clientY - sy) * 0.01;
            meshRef.current.rotation.y += dx;
            meshRef.current.rotation.x += dy;
            sx = e.clientX;
            sy = e.clientY;
        });

        // Zoom with mouse wheel
        const handleWheel = (e) => {
            e.preventDefault();
            const delta = e.deltaY * 0.001;
            const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomRef.current - delta));
            zoomRef.current = newZoom;

            // Update camera position based on zoom
            const baseDistance = 120;
            camera.position.setZ(baseDistance / newZoom);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        // Loop
        const tick = () => {
            frameRef.current = requestAnimationFrame(tick);
            renderer.render(scene, camera);
        };
        tick();

        return () => {
            cancelAnimationFrame(frameRef.current);
            ro.disconnect();
            container.removeEventListener('wheel', handleWheel);
            if (meshRef.current) {
                scene.remove(meshRef.current);
                meshRef.current.geometry?.dispose();
                meshRef.current.material?.dispose();
            }
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, [height, background, initialZoom, minZoom, maxZoom]);

    useEffect(() => {
        if (!url || !sceneRef.current) return;
        const loader = new STLLoader();
        let disposed = false;

        loader.load(
            url,
            (geometry) => {
                if (disposed) return;
                geometry.computeBoundingBox();
                const bb = geometry.boundingBox;
                const size = new THREE.Vector3();
                bb.getSize(size);
                const maxDim = Math.max(size.x, size.y, size.z) || 1;
                const scale = 80 / maxDim;
                geometry.center();
                geometry.scale(scale, scale, scale);

                const mat = new THREE.MeshPhongMaterial({ color });
                const mesh = new THREE.Mesh(geometry, mat);

                if (meshRef.current) {
                    sceneRef.current.remove(meshRef.current);
                    meshRef.current.geometry?.dispose();
                    meshRef.current.material?.dispose();
                }
                meshRef.current = mesh;
                sceneRef.current.add(mesh);

                const cam = cameraRef.current;
                cam.position.set(0, 0, 120 / zoomRef.current);
                cam.lookAt(0, 0, 0);
            },
            undefined,
            (err) => console.error('STL load error:', err)
        );

        return () => { disposed = true; };
    }, [url, color]);

    return <div ref={containerRef} style={{ width: '100%', height }} />;
};

export default StlCanvas;

