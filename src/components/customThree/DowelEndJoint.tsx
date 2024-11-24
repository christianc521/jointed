import * as THREE from 'three';
import { getTriangles } from '../helpers/GetFaceNormal';
import { useRef } from 'react';

const endSphere = new THREE.CapsuleGeometry(1, .5, 2, 6).translate(0, 0.5, 0);
const material = new THREE.MeshBasicMaterial({ wireframe: true, color: "red" });

export function DowelEndJoint() {

  let testPos = useRef(new THREE.Vector3);

  function getFaceNormal(obj: THREE.Mesh, faceIndex: number) {
    const indexShift = (faceIndex - 1) % 2;

    const vectorA: THREE.Vector3 | undefined = getTriangles(obj, faceIndex);
    const vectorB: THREE.Vector3 | undefined = getTriangles(obj, faceIndex + indexShift);
    const vectorAverage = new THREE.Vector3();

    vectorAverage.addVectors(vectorA, vectorB);
    vectorAverage.x = vectorAverage.x / 2;
    vectorAverage.y = vectorAverage.y / 2;
    vectorAverage.z = vectorAverage.z / 2;

    testPos.current.copy(vectorAverage);

    const testCylinder = new THREE.CylinderGeometry(1, 1, 3);
    const testMat = new THREE.MeshMatcapMaterial({ flatShading: true })

    console.log("triggered")
    return;
  }


  return (
    <mesh geometry={endSphere} material={material} onPointerDown={(e) => (getFaceNormal(e.object, e.faceIndex))} />
  );
}
