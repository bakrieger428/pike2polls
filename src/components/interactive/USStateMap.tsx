'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import MapTooltip from './MapTooltip';

// State data interface
interface StateInfo {
  status: 'none' | 'regulated' | 'restricted';
  color: 'success' | 'warning' | 'error' | 'muted';
  distance: number;
  programs: string;
  notes: string;
}

interface USStateMapProps {
  className?: string;
  onStateClick?: (stateName: string, data: StateInfo) => void;
}

// State data matching the original implementation
const stateData: Record<string, StateInfo> = {
  "Alabama": { status: "none", color: "muted", distance: 4.2, programs: "Souls to the Polls, BVM bus tours", notes: "No specific voter transport law" },
  "Alaska": { status: "none", color: "muted", distance: 8.1, programs: "Volunteer driver networks in rural areas", notes: "Remote communities face extreme distances" },
  "Arizona": { status: "none", color: "success", distance: 4.5, programs: "Rideshare2Vote active, tribal programs", notes: "No restrictions on voter transportation" },
  "Arkansas": { status: "none", color: "muted", distance: 4.8, programs: "Limited formal programs", notes: "No specific law" },
  "California": { status: "regulated", color: "warning", distance: 3.2, programs: "Uber restricted due to legal concerns", notes: "State legal questions limited Uber 2024 program" },
  "Colorado": { status: "none", color: "success", distance: 3.6, programs: "Universal mail-in voting reduces need", notes: "Primarily vote-by-mail state" },
  "Connecticut": { status: "none", color: "success", distance: 2.1, programs: "NAACP, local GOTV", notes: "No restrictions" },
  "Delaware": { status: "none", color: "success", distance: 2.3, programs: "Local church programs", notes: "No restrictions" },
  "Florida": { status: "none", color: "success", distance: 3.8, programs: "Souls to the Polls birthplace, major programs", notes: "Early voting targeted by restrictions in 2012, later restored" },
  "Georgia": { status: "restricted", color: "error", distance: 5.6, programs: "Fair Fight, New Georgia Project, Rideshare2Vote, Plus1Vote", notes: "SB 202 restricted voting buses; Election Board ruled Lyft discounts illegal (2025)" },
  "Hawaii": { status: "none", color: "success", distance: 2.8, programs: "Vote-by-mail state", notes: "Primarily mail-in voting" },
  "Idaho": { status: "none", color: "muted", distance: 5.2, programs: "Limited formal programs", notes: "No specific law" },
  "Illinois": { status: "none", color: "success", distance: 2.9, programs: "Chicago GOTV operations, union programs", notes: "No restrictions" },
  "Indiana": { status: "none", color: "muted", distance: 3.8, programs: "Local church and nonprofit programs", notes: "No specific voter transport law" },
  "Iowa": { status: "none", color: "muted", distance: 4.1, programs: "Limited formal programs", notes: "No specific law" },
  "Kansas": { status: "none", color: "muted", distance: 4.6, programs: "Limited formal programs", notes: "No specific law" },
  "Kentucky": { status: "none", color: "muted", distance: 4.3, programs: "BVM bus stops", notes: "No specific law" },
  "Louisiana": { status: "none", color: "muted", distance: 4.0, programs: "Power Coalition, BVM tours", notes: "No specific law" },
  "Maine": { status: "none", color: "success", distance: 3.4, programs: "Local volunteer programs", notes: "No restrictions" },
  "Maryland": { status: "none", color: "success", distance: 2.6, programs: "MTA free transit on Election Day (2024)", notes: "First free transit Election Day in 2024" },
  "Massachusetts": { status: "none", color: "success", distance: 2.0, programs: "Local GOTV programs", notes: "No restrictions" },
  "Michigan": { status: "none", color: "success", distance: 3.5, programs: "Harvard/BU study site; ban repealed 2020", notes: "Historic: banned voter transport 1891–2020 (129 years)" },
  "Minnesota": { status: "none", color: "success", distance: 3.3, programs: "Four Directions tribal program, satellite offices", notes: "No restrictions, tribal voting improvements" },
  "Mississippi": { status: "none", color: "muted", distance: 5.3, programs: "BVM bus tours", notes: "5.3 mi avg distance — among highest" },
  "Missouri": { status: "none", color: "muted", distance: 4.2, programs: "BVM bus stops", notes: "No specific law" },
  "Montana": { status: "none", color: "muted", distance: 7.2, programs: "Four Directions, Fort Peck tribal program", notes: "Tribal members travel 30–60 miles to vote" },
  "Nebraska": { status: "none", color: "muted", distance: 4.5, programs: "Limited formal programs", notes: "No specific law" },
  "Nevada": { status: "none", color: "success", distance: 3.9, programs: "Culinary Union casino shuttles, Rideshare2Vote", notes: "Major union-organized voter transport" },
  "New Hampshire": { status: "none", color: "success", distance: 2.8, programs: "Local programs", notes: "No restrictions" },
  "New Jersey": { status: "none", color: "success", distance: 2.2, programs: "NJ STTP expansion", notes: "No restrictions" },
  "New Mexico": { status: "none", color: "muted", distance: 5.8, programs: "Tribal voting programs", notes: "Ballot collection limits affect tribal lands" },
  "New York": { status: "none", color: "success", distance: 2.4, programs: "NYC GOTV programs, union operations", notes: "No restrictions" },
  "North Carolina": { status: "none", color: "muted", distance: 3.9, programs: "Souls to the Polls, BVM tours", notes: "Early voting restrictions debated" },
  "North Dakota": { status: "none", color: "muted", distance: 6.1, programs: "ND Native Vote, Four Directions", notes: "ID requirements affect tribal voters" },
  "Ohio": { status: "none", color: "muted", distance: 3.6, programs: "BVM tours, Cleveland STTP caravans", notes: "Early voting restrictions debated" },
  "Oklahoma": { status: "none", color: "muted", distance: 5.0, programs: "Limited formal programs", notes: "No specific law" },
  "Oregon": { status: "none", color: "success", distance: 3.0, programs: "Universal mail-in voting", notes: "All-mail election state since 2000" },
  "Pennsylvania": { status: "none", color: "success", distance: 3.1, programs: "Philadelphia GOTV, BVM tours, Rideshare2Vote", notes: "+12% Lyft surge in 2022" },
  "Rhode Island": { status: "none", color: "success", distance: 1.8, programs: "Local programs", notes: "Smallest state, short distances" },
  "South Carolina": { status: "none", color: "muted", distance: 4.4, programs: "BVM bus tours", notes: "No specific law" },
  "South Dakota": { status: "none", color: "muted", distance: 6.3, programs: "Four Directions doubled Native turnout", notes: "Aggressive tribal GOTV operations" },
  "Tennessee": { status: "none", color: "muted", distance: 4.1, programs: "BVM bus tours", notes: "No specific law" },
  "Texas": { status: "regulated", color: "warning", distance: 5.8, programs: "BVM tours, local GOTV", notes: "HB 521 (2025) requires disclosure for organized rides; longest avg distance (5.8 mi)" },
  "Utah": { status: "none", color: "success", distance: 3.7, programs: "Vote-by-mail option", notes: "Primarily mail-in voting" },
  "Vermont": { status: "none", color: "success", distance: 2.5, programs: "Local programs", notes: "No restrictions" },
  "Virginia": { status: "none", color: "success", distance: 3.0, programs: "Local GOTV programs", notes: "No restrictions" },
  "Washington": { status: "none", color: "success", distance: 3.1, programs: "Universal mail-in voting", notes: "All-mail state" },
  "West Virginia": { status: "none", color: "muted", distance: 4.8, programs: "Limited formal programs", notes: "Rural transportation challenges" },
  "Wisconsin": { status: "none", color: "success", distance: 3.2, programs: "STTP Wisconsin (450+ congregations), Four Directions", notes: "Milwaukee: highest turnout of 50 largest cities, 2024; +12% Lyft surge 2022" },
  "Wyoming": { status: "none", color: "muted", distance: 7.5, programs: "Limited formal programs", notes: "Sparse population, long distances" },
};

const USStateMap: React.FC<USStateMapProps> = ({ className = '', onStateClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    stateName: string;
    data: StateInfo;
  }>({ visible: false, x: 0, y: 0, stateName: '', data: stateData['Alabama'] });

  const getColorMap = () => {
    const styles = getComputedStyle(document.documentElement);
    return {
      success: styles.getPropertyValue('--color-success').trim() || '#10b981',
      warning: styles.getPropertyValue('--color-warning').trim() || '#f59e0b',
      error: styles.getPropertyValue('--color-error').trim() || '#ef4444',
      muted: styles.getPropertyValue('--color-text-faint').trim() || '#9ca3af',
      bg: styles.getPropertyValue('--color-bg').trim() || '#ffffff',
    };
  };

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const colors = getColorMap();
    const width = container.clientWidth;
    const height = width / 1.6;

    // Set SVG dimensions explicitly
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const projection = d3.geoAlbersUsa().fitSize([width, height], { type: 'Sphere' });
    const path = d3.geoPath().projection(projection);

    // Load US atlas data
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .then((us: any) => {
        const states = feature(us, us.objects.states);

        // Create state paths
        d3.select(svg)
          .selectAll('path')
          .data((states as any).features)
          .join('path')
          .attr('d', (d: any) => path(d) as string)
          .attr('fill', (d: any) => {
            const name = d.properties.name;
            const st = stateData[name];
            return st ? colors[st.color] || colors.muted : colors.muted;
          })
          .attr('stroke', colors.bg)
          .attr('stroke-width', 1)
          .style('cursor', 'pointer')
          .style('transition', 'opacity 0.2s ease')
          .on('mouseover', function(event, d: any) {
            d3.select(this).attr('opacity', 0.8);
            const name = d.properties.name;
            const st = stateData[name];
            if (st) {
              setTooltip({
                visible: true,
                x: event.clientX,
                y: event.clientY,
                stateName: name,
                data: st,
              });
            }
          })
          .on('mousemove', function(event) {
            setTooltip(prev => ({ ...prev, x: event.clientX + 16, y: event.clientY - 10 }));
          })
          .on('mouseout', function() {
            d3.select(this).attr('opacity', 1);
            setTooltip(prev => ({ ...prev, visible: false }));
          })
          .on('click', function(event, d: any) {
            const name = d.properties.name;
            const st = stateData[name];
            if (st && onStateClick) {
              onStateClick(name, st);
            }
          });

        // Add state borders
        d3.select(svg)
          .append('path')
          .datum(mesh(us, us.objects.states, (a: any, b: any) => a !== b))
          .attr('fill', 'none')
          .attr('stroke', colors.bg)
          .attr('stroke-width', 1)
          .attr('d', path);
      })
      .catch(() => {
        // Handle loading error
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '50%');
        text.setAttribute('y', '50%');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', colors.muted);
        text.textContent = 'Map data loading... Please ensure you\'re connected to the internet.';
        svg.appendChild(text);
      });
  }, [onStateClick]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Rebuild map on resize
      const svg = svgRef.current;
      const container = containerRef.current;
      if (!svg || !container) return;

      const colors = getColorMap();
      const width = container.clientWidth;
      const height = width / 1.6;

      // Set SVG dimensions explicitly
      svg.setAttribute('width', width.toString());
      svg.setAttribute('height', height.toString());
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

      // Clear and rebuild
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      const projection = d3.geoAlbersUsa().fitSize([width, height], { type: 'Sphere' });
      const path = d3.geoPath().projection(projection);

      d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
        .then((us: any) => {
          const states = feature(us, us.objects.states);

          d3.select(svg)
            .selectAll('path')
            .data((states as any).features)
            .join('path')
            .attr('d', (d: any) => path(d) as string)
            .attr('fill', (d: any) => {
              const name = d.properties.name;
              const st = stateData[name];
              return st ? colors[st.color] || colors.muted : colors.muted;
            })
            .attr('stroke', colors.bg)
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .style('transition', 'opacity 0.2s ease')
            .on('mouseover', function(event, d: any) {
              d3.select(this).attr('opacity', 0.8);
              const name = d.properties.name;
              const st = stateData[name];
              if (st) {
                setTooltip({
                  visible: true,
                  x: event.clientX,
                  y: event.clientY,
                  stateName: name,
                  data: st,
                });
              }
            })
            .on('mousemove', function(event) {
              setTooltip(prev => ({ ...prev, x: event.clientX + 16, y: event.clientY - 10 }));
            })
            .on('mouseout', function() {
              d3.select(this).attr('opacity', 1);
              setTooltip(prev => ({ ...prev, visible: false }));
            })
            .on('click', function(event, d: any) {
              const name = d.properties.name;
              const st = stateData[name];
              if (st && onStateClick) {
                onStateClick(name, st);
              }
            });

          d3.select(svg)
            .append('path')
            .datum(mesh(us, us.objects.states, (a: any, b: any) => a !== b))
            .attr('fill', 'none')
            .attr('stroke', colors.bg)
            .attr('stroke-width', 1)
            .attr('d', path);
        })
        .catch(() => {
          // Handle error silently
        });
    };

    const debouncedResize = setTimeout(handleResize, 300);
    return () => clearTimeout(debouncedResize);
  }, [onStateClick]);

  return (
    <>
      <div ref={containerRef} className={`us-state-map-container w-full ${className}`} style={{ minHeight: '400px' }}>
        <svg
          ref={svgRef}
          className="us-state-map w-full h-auto"
          style={{ minHeight: '400px' }}
          role="img"
          aria-label="Interactive map of the United States showing voter transportation programs by state"
        />
      </div>
      <MapTooltip
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        stateName={tooltip.stateName}
        data={tooltip.data}
      />
    </>
  );
};

export default USStateMap;
