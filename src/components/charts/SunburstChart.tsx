import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

export interface SunburstData {
  name: string;
  value?: number;
  children?: SunburstData[];
  correct?: number;
  wrong?: number;
  notAttempted?: number;
  percentage?: number;
}

interface SunburstChartProps {
  data: SunburstData;
  width?: number;
  height?: number;
  onHover?: (data: SunburstData | null) => void;
}

const SunburstChart: React.FC<SunburstChartProps> = ({
  data,
  width = 400,
  height = 400,
  onHover,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: SunburstData | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const size = Math.min(containerWidth - 40, 500); // Max width 500px
        setDimensions({ width: size, height: size });
      }
    };

    // Initial size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draw the sunburst chart
  useEffect(() => {
    if (!svgRef.current || !data) return;

    const radius = Math.min(dimensions.width, dimensions.height) / 2 - 10;
    const format = d3.format(",d");

    // Create a partition layout
    const partition = (data: any) => {
      const root = d3.hierarchy(data)
        .sum((d: any) => d.value || 0)
        .sort((a: any, b: any) => b.value - a.value);
      return d3.partition().size([2 * Math.PI, root.height + 1])(root);
    };

    // Create the arc generator
    const arc = d3.arc()
      .startAngle((d: any) => d.x0)
      .endAngle((d: any) => d.x1)
      .padAngle(1 / radius)
      .padRadius(radius / 2)
      .innerRadius((d: any) => d.y0 * radius)
      .outerRadius((d: any) => Math.max(d.y0 * radius, d.y1 * radius - 1));

    // Create color scale
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children ? data.children.length + 1 : 1));

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG group
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
      .style("font", "10px sans-serif");

    const g = svg.append("g")
      .attr("transform", `translate(${dimensions.width / 2},${dimensions.height / 2})`);

    // Process the data
    const root = partition(data);

    // Add the arcs
    const cell = g.selectAll("g")
      .data(root.descendants())
      .join("g");

    // Add the arc paths
    cell.append("path")
      .attr("d", arc as any)
      .attr("fill-opacity", 0.8)
      .attr("fill", (d: any) => {
        if (d.depth === 1) return color(d.data.name);
        if (d.depth > 1) return d3.color(color(d.parent.data.name))?.darker(0.2)?.toString() || "#ccc";
        return "#ffffff";
      })
      .style("cursor", "pointer")
      .on("mouseover", (event: MouseEvent, d: any) => {
        if (d.depth > 0) {
          d3.select(event.currentTarget as any)
            .attr("fill-opacity", 1);
          
          setTooltip({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            data: d.data
          });
          
          if (onHover) onHover(d.data);
        }
      })
      .on("mousemove", (event: MouseEvent) => {
        setTooltip(prev => ({
          ...prev,
          x: event.pageX,
          y: event.pageY
        }));
      })
      .on("mouseout", (event: MouseEvent, d: any) => {
        d3.select(event.currentTarget as any)
          .attr("fill-opacity", 0.8);
        
        setTooltip(prev => ({ ...prev, visible: false }));
        if (onHover) onHover(null);
      });

    // Add labels for the main categories
    cell.filter((d: any) => d.depth === 1 && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10)
      .append("text")
      .attr("transform", (d: any) => {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", (d: any) => ((d.x0 + d.x1) / 2 * 180 / Math.PI < 180 ? "start" : "end"))
      .text((d: any) => d.data.name)
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("fill", "#fff")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.7)");

  }, [data, dimensions, onHover]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
      
      {tooltip.visible && tooltip.data && (
        <motion.div
          className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 pointer-events-none z-50 border border-gray-200 dark:border-gray-700"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 10}px`,
            minWidth: '200px',
            transform: 'translateY(-100%)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {tooltip.data.name}
          </div>
          
          {tooltip.data.percentage !== undefined && (
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Taxa de acerto:</span>
                <span className="font-semibold">{tooltip.data.percentage}%</span>
              </div>
            </div>
          )}
          
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between text-xs">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                <span>Acertos:</span>
              </div>
              <span className="font-medium">{tooltip.data.correct || 0}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                <span>Erros:</span>
              </div>
              <span className="font-medium">{tooltip.data.wrong || 0}</span>
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-gray-300 mr-1"></span>
                <span>Não fez:</span>
              </div>
              <span className="font-medium">{tooltip.data.notAttempted || 0}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SunburstChart;