import { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  Position,
} from "reactflow";

import "reactflow/dist/style.css";
import "./App.css";
import { initialNodes } from "./nodes/nodes";
import { initialEdges } from "./edges/edges";
import Data from "./placeholderData.js/Data";

function App() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [newNodeAdded, setNewNodeAdded] = useState({ label: "" });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dataNodePosition, setDataNodePosition] = useState({ x: "", y: "" });

  // Close the Popup Data
  const onClose = () => {
    setIsPopupOpen(false);
  };

  // when clicked on a NODE
  const onClick = (e, nodeClickedId) => {
    e.stopPropagation();
    setIsPopupOpen(!isPopupOpen);
    if (isPopupOpen) {
      // return console.log("popup closed");
    }
    if (!isPopupOpen) {
      // Calculate position for Data node relative to selected node
      const selectedNode = nodes.find((node) => node.id === nodeClickedId);
      // console.log(selectedNode)
      if (selectedNode) {
        const dataNodePosition = {
          x: selectedNode.position.x + 200,
          y: selectedNode.position.y - 500,
        };

        return setDataNodePosition(dataNodePosition);
      }
    }
  };

  // Id for new node
  const getNodeId = () => `randomnode_${+new Date()}`;

  // to add node
  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        fontSize: 20,
        fontWeight: 500,
        backgroundColor: "silver",
      },
      data: { label: `${newNodeAdded.label}`, info: "No Data Available" },
      position: {
        x: 600,
        y: 0 + (nodes.length + 1) * 10,
      },
    };
    // console.log(newNode.data, newNode.id);
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes, newNodeAdded]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // to delete Node
  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge)
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges, setEdges]
  );

  return (
    <ReactFlowProvider>
      <div style={{ width: "100vw", height: "100vh" }} onClick={onClose}>
        {/* buttons to add or edit node */}
        <div className="container">
          {/* Header */}
          <div className="addDiv">
            <input
              type="text"
              className="addNode"
              placeholder="Add Node..."
              onChange={(e) => {
                setNewNodeAdded({ ...newNodeAdded, label: e.target.value }); // Set newNodeAdded as an object with label property
              }}
            />
            <button className="addNodeBtn" onClick={onAdd}>
              Add node
            </button>
            <p style={{ color: "lightgrey", fontSize: "12px" }}>
              {" "}
              To Delete a node, Select the node and press 'Backspace'. Click on the 
              Node to see the Data.
            </p>
          </div>
        </div>

        {/* Flowchart */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          preventScrolling={false}
          fitView={true}
          onNodeClick={(e, node) => {
            setSelectedNodeId(node.id);
            onClick(e, node.id);
          }}
          className="flowchart"
        ></ReactFlow>

        {/* Data on nodeclick */}
        {dataNodePosition && isPopupOpen && (
          <Data
            nodeId={selectedNodeId}
            nodes={nodes}
            onClick={onClick}
            dataNodePosition={dataNodePosition}
            onClose={onClose}
          />
        )}

        <MiniMap pannable zoomable />
        <Controls />
      </div>
    </ReactFlowProvider>
  );
}
export default App;
