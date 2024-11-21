import React from "react";
import { useBoundStore } from '../../stores/useBoundStore';
import styles from "./leftpanel.module.css";
export const LeftPanel: React.FC = () => {

  const parts = useBoundStore((state) => state.parts);
  const removePart = useBoundStore((state) => state.removePart);
  const setActivePartID = useBoundStore((state) => state.setActivePartID);

  const Panel = () => (
    parts?.map((part, index) =>
      <div className={styles.partRow}>
        <p key={index} onClick={() => setActivePartID(part.id)} className={styles.partName} >
          {part.type}
        </p>
        <button onClick={() => removePart(part.id)}>
          Delete
        </button>
      </div>
    )
  );


  return (
    <div className={styles.panel}>
      <h3 className={styles.heading}> workbench </h3>
      <div className={styles.innerPanel}>
        {parts ? <Panel /> : <div> <p className={styles.partName}> start adding parts </p> </div>}
      </div>
    </div>
  )
}
