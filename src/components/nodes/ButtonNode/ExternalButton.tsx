import React, {memo, useMemo} from "react";
import * as styles from "./styles";
import externalIcon from "./external.svg";
import {useSearch} from "../../../context/SearchContext";
import {MarkdownRenderer} from "../../shared";
import {highlightChildren} from "../../../utils/highlight";

const ExternalButton: React.FC<{ label: string }> = ({ label }) => {
    const { search } = useSearch();

    //в этой кнопке-ссылке по дизайну должна показываться ссылка, а не md разметка, а остальной md отключён
    const components = useMemo(() => ({
        p: ({ children }: any) => (
            <span style={styles.labelEllipsis}>
                {highlightChildren(children, search)}
            </span>
        ),
        h1: ({ children }: any) => <>{highlightChildren(children, search)}</>,
        h2: ({ children }: any) => <>{highlightChildren(children, search)}</>,
        em: ({ children }: any) => <>{highlightChildren(children, search)}</>,
        strong: ({ children }: any) => <>{highlightChildren(children, search)}</>,
        del: ({ children }: any) => <>{highlightChildren(children, search)}</>,
        span: ({ children }: any) => <>{highlightChildren(children, search)}</>,
        text: ({ children }: any) => <>{highlightChildren(children, search)}</>,
    }), [search])

    return (
        <div style={styles.link}>
            <img src={externalIcon} alt={''} />
            <MarkdownRenderer text={label} search={search} components={components} />
        </div>
    );
};

export default memo(ExternalButton);