import { ReactFlow, Controls, Background, useNodesState, useEdgesState }from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useCallback } from 'react';

function Diagram(props) {

	// const nodes = [0,1,2].map((a, index) => {
	// 	return {
	// 		id: `${index}`,
	// 		position: { x: 0, y: index * 50}
	// 	}
	// });
      
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [containerWidth, setContainerWidth] = useState(0);

	const measureRef = useCallback(node => {
		if (node !== null) {
			setContainerWidth(node.getBoundingClientRect().width);
		}
	}, []);

	useEffect(() => {
		const parent = {
			header: props.title,
			url: props.url,
			sources: props.sources.slice(0, 5).map(source => {
				return {
					header: source.sentence,
					url: source.url,
					sources: [] // TODO support recursion
				}
			})
		}

		const nodeWidth = 150; // Adjust based on your node size
		const nodeHeight = 50;
		const gap = 20; // Gap between nodes
		const totalNodeWidth = nodeWidth * 5 + gap * 4;
		const startX = (containerWidth - totalNodeWidth) / 2;

		const newNodes = [
			{
				id: '0',
				data: {
					label: <a href={parent.url}>{parent.header}</a>
				},
				position: { x: (containerWidth - nodeWidth)/2, y: -50},
				style: {width: nodeWidth, height: nodeHeight}
			}, ...parent.sources.map((source, index) => {
				return {
					id: `${index + 1}`,
					data: {
						label: <a href={source.url}>{source.header}</a>
					},
					position: {
						x: startX + index * (nodeWidth + gap),
						y: 100
					},
					style: {width: nodeWidth, height: nodeHeight}
				}
			})
		]

		setNodes(newNodes)
	}, [props.sources])

	return (
		<div className="Diagram" style={{ height: '100%' }} ref={measureRef}>
            <div style={{ height: '100%' }}>
                <ReactFlow 
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					fitView
				>
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
		</div>
	);
}

export default Diagram;
