import React, { useRef, forwardRef } from 'react';
import { PivotControls } from '@react-three/drei';
import { Matrix4, Mesh } from 'three';
import * as THREE from 'three';
import { partsConfig, PartType } from '../config/parts';
import type { PartProps } from '../types/index';
import { useBoundStore } from '../stores/useBoundStore';

export const Part = forwardRef<Mesh, PartProps>((props, ref) => {
  const mesh = ref as React.RefObject<Mesh>;
  const matrix = useRef(new Matrix4());
  matrix.current.setPosition(props.position[0], props.position[1], props.position[2]);
  const lastPosition = useRef<number[]>(props.position);
  const lastRotation = useRef<number[]>(props.rotation);
  const setSelectedFacePosition = useBoundStore((state) => state.setSelectedFacePosition);
  const positionChange = useBoundStore((state) => state.positionChange);


  return (
    <>
      {props.active && props.type !== 'joint' ? (
        <PivotControls
          autoTransform={true}
          anchor={[0, 0, 0]}
          matrix={matrix.current}
          onDragEnd={() => {
            if (mesh.current) {
              const position = new THREE.Vector3(mesh.current?.position.x, mesh.current?.position.y, mesh.current?.position.z);
              const rotation = new THREE.Quaternion(mesh.current?.rotation.x, mesh.current?.rotation.y, mesh.current?.rotation.z, 1);
              const scale = new THREE.Vector3(1, props.dimensions.height, 1);

              matrix.current.decompose(position, rotation, scale);
              const euler = new THREE.Euler().setFromQuaternion(rotation);
              let newPosition = [position.x, position.y, position.z];
              const newRotation: number[] = [euler.x, euler.y, euler.z];
              lastPosition.current = newPosition;
              lastRotation.current = newRotation;
              positionChange(props.id, newPosition, newRotation);
            }
          }}

        >
          <mesh
            ref={mesh}
            scale={[1, props.dimensions.height, 1]}
            onClick={(e) => {
              e.stopPropagation();
              props.onClick?.();
              if (partsConfig[props.type as PartType].selectableFaceIndexes.includes(e.faceIndex || 0)) {
                setSelectedFacePosition(props.position);
              }
            }}
          >
            <primitive object={partsConfig[props.type as PartType].shape.clone()} attach="geometry" />
            {partsConfig[props.type as PartType].material.map((material, index) => (
              <meshStandardMaterial
                key={index}
                {...material}
                wireframe={true}
              />
            ))}
          </mesh>
        </PivotControls>
      ) : (
        <mesh
          position={props.position}
          rotation={props.rotation}
          userData={{ isFaceSelected: false }}
          scale={[props.dimensions.width, props.dimensions.height, props.dimensions.depth]}
          onClick={(e) => {
            e.stopPropagation();
            props.onClick?.();
            if (partsConfig[props.type as PartType].selectableFaceIndexes.includes(e.faceIndex || 0)) {
              setSelectedFacePosition(props.position);
            }
          }}
        >
          <primitive
            object={partsConfig[props.type as PartType].shape.clone()}
            attach="geometry"
          />
          {partsConfig[props.type as PartType].material.map((material, index) => (
            <meshStandardMaterial
              key={index}
              {...material}
            />
          ))}
        </mesh>
      )}
    </>
  );
});
