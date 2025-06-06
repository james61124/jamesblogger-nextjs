// CustomEdge.tsx
import { BaseEdge, getStraightPath } from 'reactflow';

export default function CustomDashedEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: '#3b82f6',
        strokeWidth: 2,
        strokeDasharray: '3,3', // 虛線樣式
      }}
    />
  );
}
