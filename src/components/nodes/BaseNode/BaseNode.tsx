// import { Handle, Position, NodeProps } from '@xyflow/react';
// import { baseNodeStyles } from './styles';
// import { ReactNode } from 'react';
// import { NodeData } from '../../../models/BaseNodeModel';
//
// type BaseNodeProps<T extends NodeData> = NodeProps<T> & {
//     children?: ReactNode;
// };
//
// export function BaseNode<T extends NodeData>({ data, children }: BaseNodeProps<T>) {
//     return (
//         <div style={baseNodeStyles.container}>
//             <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
//             <div style={baseNodeStyles.label}>{data.label}</div>
//             {children}
//         </div>
//     );
// }