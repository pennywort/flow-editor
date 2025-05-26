import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { highlightChildren } from '../../../utils/highlight';
import preprocessCustomMarkdown from '../../../utils/preprocessCustomMarkdown';

import * as styles from './styles';

type MarkdownRendererProps = {
    text: string;
    search?: string;
    components?: Record<string, any>; // расширяемый список (переопределить элементы)
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
	text,
	search = '',
	components = {},
}) => {
	const baseComponents = useMemo(() => ({
		a: ({ children, href }: any) => (
			<a href={href} target="_blank" rel="noreferrer" style={styles.link}>
				{highlightChildren(children, search)}
			</a>
		),
		p: ({ children }: any) => (
			<p style={styles.p}>
				{highlightChildren(children, search)}
			</p>
		),
		h1: ({ children }: any) => (
			<h1 style={styles.h1}>
				{highlightChildren(children, search)}
			</h1>
		),
		h2: ({ children }: any) => (
			<h2 style={styles.h2}>
				{highlightChildren(children, search)}
			</h2>
		),
		em: ({ children }: any) => (
			<em>
				{highlightChildren(children, search)}
			</em>
		),
		strong: ({ children }: any) => (
			<strong>
				{highlightChildren(children, search)}
			</strong>
		),
		del: ({ children }: any) => (
			<del>
				{highlightChildren(children, search)}
			</del>
		),
		span: ({ children }: any) => (
			<span style={styles.labelEllipsis}>
				{highlightChildren(children, search)}
			</span>
		),
		li: ({ children }: any) => (
			<li>
				{highlightChildren(children, search)}
			</li>
		),
		// text: ({ children }: any) => <>{highlightChildren(children, search)}</>,
		...components,
	}), [search, components]);

	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={baseComponents}
		>
			{preprocessCustomMarkdown(text)}
		</ReactMarkdown>
	);
};

export default MarkdownRenderer;
