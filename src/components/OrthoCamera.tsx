// import * as THREE from "three";
// 
// export class OrthoCamera extends THREE.OrthographicCamera {
//   constructor(renderingContext: HTMLCanvasElement) {
// 
//     const aspect = renderingContext.offsetWidth / renderingContext.offsetHeight;
//     const frustumSize = 25;
// 
//     super(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000);
// 
//   }
// }
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrthographicCamera } from "three";

interface OrthoCameraProps {
  zoom?: number;
  position?: [number, number, number];
  frustumSize?: number;
}

export const OrthoCamera = ({
  zoom = 100,
  position = [3, 3, 3],
  frustumSize = 25
}: OrthoCameraProps) => {
  const { size, set } = useThree();
  const cameraRef = useRef<OrthographicCamera>();

  useEffect(() => {
    if (!cameraRef.current) return;

    const aspect = size.width / size.height;
    const camera = cameraRef.current;

    // Update camera frustum
    camera.left = (-frustumSize * aspect) / 2;
    camera.right = (frustumSize * aspect) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
    camera.near = -1000;
    camera.far = 1000;

    camera.position.set(...position);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();

    // Set this camera as the active camera
    set({ camera });
  }, [size, set, zoom, position, frustumSize]);

  // Handle window resize
  useFrame(() => {
    if (!cameraRef.current) return;

    const aspect = size.width / size.height;
    const camera = cameraRef.current;

    camera.left = (-frustumSize * aspect) / 2;
    camera.right = (frustumSize * aspect) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;

    //    camera.updateProjectionMatrix();
  });

  return <orthographicCamera ref={cameraRef} />;
};
