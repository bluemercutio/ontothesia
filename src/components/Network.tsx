import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  EmbeddingNetwork,
  GraphNode,
  GraphEdge,
} from "../services/graph/interface";
import { NetworkOverlay } from "./NetworkOverlay";

import { Artefact } from "@ontothesia/types/artefact";

type SimNode = d3.SimulationNodeDatum & GraphNode;
type SimLink = d3.SimulationLinkDatum<SimNode> & GraphEdge;

type NetworkProps = {
  data: EmbeddingNetwork; // Graph structure with nodes and links
  width?: number;
  height?: number;
  currentNodeId: string;
  handleSelectedNode: (node: GraphNode) => void;
  artefact: Artefact;
};

export const Network: React.FC<NetworkProps> = ({
  data,
  width = 800,
  height = 600,
  currentNodeId,
  handleSelectedNode,
  artefact,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentNode, setCurrentNode] = useState<GraphNode | null>(null);
  useEffect(() => {
    const foundNode = data.nodes.find((n) => n.id === currentNodeId);
    setCurrentNode(foundNode ?? null);
  }, [currentNodeId, data.nodes]);

  if (!artefact) {
    throw new Error("No artefact");
  }

  useEffect(() => {
    if (!data || !data.nodes || !data.edges) {
      console.error("No data");
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const nodes = data.nodes as SimNode[];
    const links = data.edges as SimLink[];

    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", 1.5);

    const clamp = (x: number, min: number, max: number) =>
      Math.max(min, Math.min(max, x));

    const constrainNode = (d: SimNode) => {
      const r = 8; // same as circle radius
      d.x = clamp(d.x!, r, width - r);
      d.y = clamp(d.y!, r, height - r);
    };

    const drag = d3
      .drag<SVGCircleElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = clamp(event.x, 8, width - 8);
        d.fy = clamp(event.y, 8, height - 8);
      })
      .on("drag", (event, d) => {
        d.fx = clamp(event.x, 8, width - 8);
        d.fy = clamp(event.y, 8, height - 8);
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 8)
      .attr("fill", (d) => (d.id === currentNodeId ? "#ff4444" : "steelblue"))
      .call(drag)
      .on("click", (event, d) => {
        // Stop propagation of this specific click
        event.stopPropagation();
        handleSelectedNode(d);
      });

    // Modify how the SVG captures events
    svg.style("pointer-events", "all");

    // When setting up svg click handler:
    // svg.on("click", function (event) {
    //   // Stop propagation to prevent the click from reaching ThreeJS
    //   event.stopPropagation();

    //   // Your existing node selection logic
    //   handleSelectedNode(data.nodes[0]);
    // });

    simulation.on("tick", () => {
      nodes.forEach(constrainNode);

      link
        .attr("x1", (d) => (d.source as SimNode).x!)
        .attr("y1", (d) => (d.source as SimNode).y!)
        .attr("x2", (d) => (d.target as SimNode).x!)
        .attr("y2", (d) => (d.target as SimNode).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
    });
  }, [data, width, height, currentNodeId, handleSelectedNode]);

  // const handleNodeSelect = (node: GraphNode) => {
  //   handleSelectedNode(node);
  // };

  return (
    <div className="flex justify-center w-full relative">
      <div
        className="absolute right-0 z-10"
        style={{
          top: "-40px", // This positions the overlay higher
        }}
      >
        <NetworkOverlay selectedNode={currentNode} artefact={artefact} />
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="relative"
      ></svg>
    </div>
  );
};
