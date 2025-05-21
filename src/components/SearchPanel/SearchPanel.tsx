import React, {memo} from "react";
import { Node, ReactFlowInstance } from "@xyflow/react";
import {
    searchPanelContainer,
    searchInput,
    resultLabel,
    navButtonActive,
    navButtonDisabled,
} from "./styles";
import {useSearch} from "../../context/SearchContext";

type Props = {
    foundNodeIds: string[];
    foundIndex: number;
    setFoundIndex: (idx: number) => void;
    nodes: Node[];
    reactFlowInstance?: ReactFlowInstance;
    inputRef?: React.RefObject<HTMLInputElement | null>;
};

const SearchPanel: React.FC<Props> = ({
                                                 foundNodeIds,
                                                 foundIndex,
                                                 setFoundIndex,
                                                 nodes,
                                                 reactFlowInstance,
                                                 inputRef
                                             }) => {
    const { search, setSearch } = useSearch();

    const centerToNode = (index: number) => {
        if (!foundNodeIds.length) return;
        const nodeId = foundNodeIds[index];
        const node = nodes.find((n) => n.id === nodeId);
        if (node && reactFlowInstance) {
            reactFlowInstance.setCenter(
                node.position.x + 180,
                node.position.y + 100,
                { zoom: 1.2, duration: 800 }
            );
        }
    };

    const goPrev = () => {
        if (!foundNodeIds.length) return;
        const newIndex = (foundIndex - 1 + foundNodeIds.length) % foundNodeIds.length;
        setFoundIndex(newIndex);
        centerToNode(newIndex);
    };

    const goNext = () => {
        if (!foundNodeIds.length) return;
        const newIndex = (foundIndex + 1) % foundNodeIds.length;
        setFoundIndex(newIndex);
        centerToNode(newIndex);
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && foundNodeIds.length > 0) {
            goNext();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "ArrowLeft") {
            e.preventDefault();
            goPrev();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "ArrowRight") {
            e.preventDefault();
            goNext();
        }
    };

    return (
        <div style={searchPanelContainer}>
            <input
                type="text"
                placeholder="Поиск..."
                ref={inputRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={onInputKeyDown}
                style={searchInput}
                aria-label="Поиск по нодам"
            />
            <span style={resultLabel}>
                {foundNodeIds.length > 0 ? `${foundIndex + 1}/${foundNodeIds.length}` : "0/0"}
            </span>
            <button
                disabled={foundNodeIds.length < 2}
                tabIndex={-1}
                title="Назад"
                onClick={goPrev}
                style={foundNodeIds.length < 2 ? navButtonDisabled : navButtonActive}
                aria-label="Предыдущее совпадение"
            >←</button>
            <button
                disabled={foundNodeIds.length < 2}
                tabIndex={-1}
                title="Вперёд"
                onClick={goNext}
                style={foundNodeIds.length < 2 ? navButtonDisabled : navButtonActive}
                aria-label="Следующее совпадение"
            >→</button>
        </div>
    );
};

export default memo(SearchPanel);