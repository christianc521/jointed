import React from "react";
import { useBoundStore } from '../../stores/useBoundStore';

export const LeftPanel: React.FC = () => {

  const parts = useBoundStore((state) => state.parts);
  const removePart = useBoundStore((state) => state.removePart);
  const setActivePartID = useBoundStore((state) => state.setActivePartID);
  const setActiveTool = useBoundStore((state) => state.setActiveTool);
  const Panel = () => (
    parts?.map((part, index) =>
      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
        <h2 key={index} onClick={() => setActivePartID(part.id)} >
          {part.type}
        </h2>
        <button onClick={() => removePart(part.id)}>
          Delete
        </button>
      </div>
    )
  );

  return <Panel />
}
