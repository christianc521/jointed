import React, { useRef, useEffect, forwardRef } from 'react';
import { PivotControls, useHelper } from '@react-three/drei';
import { BoxHelper, Matrix4, Mesh } from 'three';
import * as THREE from 'three';
import { PART_TYPES, partsConfig, PartType } from '../config/parts';
import { useControls } from 'leva';
import type { PartProps } from '../types/index';


export const Part: React.FC<PartProps> = forwardRef((props, ref) => {
  const mesh = ref as React.RefObject<Mesh>;
  const pivotRef = useRef<typeof PivotControls>(null);
  const matrix = useRef(new Matrix4());
  matrix.current.setPosition(props.position[0], props.position[1], props.position[2]);
  const lastPosition = useRef<[number, number, number]>(props.position);
  const lastRotation = useRef<[number, number, number]>(props.rotation);
  
  
  useHelper(props.active ? mesh.current : undefined, BoxHelper, 'cyan');

  // useEffect(() => {
  //   if (mesh.current) {
  //     pivotMatrix.current.makeRotationFromEuler(new THREE.Euler(...props.rotation));
  //     // pivotMatrix.current.setPosition(...props.position);
  //   }
  // }, [props.position, props.rotation]);

  // const {scaleY} = useControls(
  //   `Part-${props.id}`, 
  //   props.active ? {
  //     scale: { 
  //       value: props.dimensions.height,
  //       min: 1, 
  //       max: 6, 
  //       step: 0.6,
  //       onChange: (value) => {
  //         if (mesh.current) {
  //           mesh.current.scale.y = value;
  //           if (props.onScaleChange) {
  //             props.onScaleChange(value);
  //             props.onPositionChange?.(lastPosition.current, lastRotation.current);
  //           }
  //         }
  //       }
  //     }
  //   } : {},
  //   { store: props.active ? undefined : null }
  // );

  return (
    <>
      {props.active && props.type !== 'joint' ? (
        <PivotControls 
          autoTransform={false}
          anchor={[0,0,0]}
          ref={pivotRef}
          matrix={matrix.current}
          onDragStart={() => {
            lastPosition.current = props.position;
            lastRotation.current = props.rotation;
            if (mesh.current) {
              mesh.current.position.set(props.position[0], props.position[1], props.position[2]);
            }
            props.onPositionChange?.(props.id, props.position, props.rotation);
            console.log('drag start', props.position);
          }}
          onDrag={(matrix_) => {
            if (mesh.current) {
              // console.log('dragging', props.position);
              matrix.current.copy(matrix_);
              const position = new THREE.Vector3(props.position[0], props.position[1], props.position[2]);
              const rotation = new THREE.Quaternion(props.rotation[0], props.rotation[1], props.rotation[2], 1);
              const scale = new THREE.Vector3(1, props.dimensions.height, 1);
              
              matrix.current.decompose(position, rotation, scale);
              const euler = new THREE.Euler().setFromQuaternion(rotation);
                
              const newPosition: [number, number, number] = [position.x, position.y, position.z];
              const newRotation: [number, number, number] = [euler.x, euler.y, euler.z];
              // pivotMatrix.current.setPosition(newPosition[0], newPosition[1], newPosition[2]);
              lastPosition.current = newPosition;
              lastRotation.current = newRotation;
              // console.log("new position", newPosition, "new rotation", newRotation);
              props.onPositionChange?.(props.id, newPosition, newRotation);
            }
          }}
          onDragEnd={() => {
            if (mesh.current) {
              // pivotMatrix.current.setPosition(lastPosition.current[0], lastPosition.current[1], lastPosition.current[2]);
              // mesh.current.position.set(props.position[0], props.position[1], props.position[2]);
              props.onPositionChange?.(props.id, lastPosition.current, lastRotation.current);
              console.log('drag end', props.position);
            }
          }}
        > 
          <mesh 
            ref={mesh} 
            userData={{isFaceSelected: false}}
            scale={[1, props.dimensions.height, 1]}
            position={props.position}
            rotation={props.rotation}
            onClick={(e) => {
              e.stopPropagation();
              props.onClick?.();
              console.log(mesh.current?.position, props.position);
              if (partsConfig[props.type as PartType].selectableFaceIndexes.includes(e.faceIndex || 0)) {
                props.onFaceSelected?.(e.faceIndex || 0);
              }
            }}
          > 
            <primitive object={partsConfig[props.type as PartType].shape.clone()} attach="geometry"/>
            {partsConfig[props.type as PartType].material.map((material, index) => (
              <meshStandardMaterial 
                key={index }
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
          userData={{isFaceSelected: false}}
          scale={[1, props.dimensions.height, 1]}
          onClick={(e) => {
            e.stopPropagation();
            props.onClick?.();
            if (partsConfig[props.type as PartType].selectableFaceIndexes.includes(e.faceIndex || 0)) {
              props.onFaceSelected?.(e.faceIndex || 0);
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