import React, {memo} from "react";
import * as styles from "./styles";
import externalIcon from "./external.svg";
import ReactMarkdown from "react-markdown";

const ExternalButton: React.FC<{ label: string }> = ({ label }) => (
    <div style={styles.link}>
        <img src={externalIcon} alt={''} />
        <ReactMarkdown
            components={{
                a: (props) => (
                    <a
                        {...props}
                        style={styles.externalLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {props.children}
                    </a>
                ),
                p: ({ children }) => (
                    <span style={styles.labelEllipsis}>{children}</span>
                ),
            }}
        >
            {label}
        </ReactMarkdown>
    </div>
);

export default memo(ExternalButton);