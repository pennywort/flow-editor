import { CSSProperties } from 'react';

export const baseNodeStyles: {
    nodeContainer: CSSProperties;
    labelContainer: CSSProperties;
    headerEllipsis: CSSProperties;
} = {
    nodeContainer: {
        backgroundColor: 'rgb(8, 8, 8)',
        color: '#fff',
        paddingTop: '0px',
        paddingBottom: '10px',
        paddingLeft: '13px',
        borderRadius: 8,
        width: 261,
        fontSize: 14,
        position: 'relative',
        boxSizing: 'border-box',
    },
    headerEllipsis: {
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        fontWeight: 'bold',
        fontSize: '13px',
        lineHeight: 1.18,
        maxHeight: '2.36em',
    },
    labelContainer: {
        fontWeight: 'bold',
        fontSize: 'smaller',
        marginLeft: -3, //compensate arrow connection
        padding: '10px 8px 10px 16px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
};