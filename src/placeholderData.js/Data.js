import React from "react";

const Data = ({ nodeId, dataNodePosition, nodes }) => {

  const popupData = () => {
    if (nodes && nodeId) {
      const clickedNode = nodes.find((node) => node.id === nodeId);
      return clickedNode ? clickedNode.data.info : null;
    }
    return null;
  };

  const getNodeData = (nodeId) => {
    const dataMap = {};
    nodes.forEach((node) => {
      dataMap[node.id] = popupData;
    });
    // console.log(dataMap[nodeId]());
    return dataMap[nodeId] ? dataMap[nodeId]() : "No data available";
  };

  return (
    <div className="container" style={{ position: "relative" }} >
      <div
        className="hover"
        style={{
          position: "absolute",
          left: dataNodePosition.x,
          top: dataNodePosition.y,
        }}
      >
        <h2>{getNodeData(nodeId)}</h2>
      </div>
    </div>
  );
};

export default Data;
