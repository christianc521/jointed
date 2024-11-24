import * as THREE from 'three';

const tri = new THREE.Triangle;
const indices = new THREE.Vector3;
const outNormal = new THREE.Vector3;
const midPoint = new THREE.Vector3;

export function getTriangles(mesh: any, faceIndex: number): THREE.Vector3 | undefined {
	const geometry = mesh.geometry;


	// Create a triangle from 
	indices.fromArray(geometry.index!.array, faceIndex * 3)
	tri.setFromAttributeAndIndices(geometry.attributes.position, indices.x, indices.y, indices.z)

	if (isNaN(midPoint.x) || isNaN(midPoint.y) || isNaN(midPoint.z)) return

	// const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 })
	// const linePoints = []
	// linePoints.push(tri.getMidpoint(midPoint))
	// linePoints.push(tri.getNormal(outNormal).add(midPoint))
	// const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints)
	// const line = new THREE.Line(lineGeometry, lineMaterial)
	// mesh.add(line)

	return tri.getMidpoint(midPoint);
}

