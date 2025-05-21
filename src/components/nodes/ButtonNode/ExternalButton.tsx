import React, {memo} from "react";
import * as styles from "./styles";
import externalIcon from "./external.svg";
import ReactMarkdown from "react-markdown";
import {useSearch} from "../../../context/SearchContext";
import {highlightChildren} from "../../../utils/highlight";

const ExternalButton: React.FC<{ label: string }> = ({ label }) => {
    const { search } = useSearch();

    return (
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
                            {highlightChildren(props.children, search)}
                        </a>
                    ),
                    p: ({ children }) => (
                        <span style={styles.labelEllipsis}>
                            {highlightChildren(children, search)}
                        </span>
                    ),
                    text: ({ children }) => <>{highlightChildren(children, search)}</>
                }}
            >
                {label}
            </ReactMarkdown>
        </div>
    );
};

export default memo(ExternalButton);