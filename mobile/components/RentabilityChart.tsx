import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line as SvgLine, Text as SvgText } from 'react-native-svg';
import { Card } from './ui/Card';

interface ChartPoint {
  year: number;
  value: number;
}

interface RentabilityChartProps {
  data: ChartPoint[];
}

export function RentabilityChart({ data }: RentabilityChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Dimensions
  const screenWidth = Dimensions.get('window').width;
  const paddingHorizontal = 16;
  const chartWidth = screenWidth - (paddingHorizontal * 2) - 32; // Card padding
  const chartHeight = 180;

  const paddingTop = 20;
  const paddingBottom = 25;
  const paddingLeft = 45;
  const paddingRight = 15;

  // Min and Max values for scaling
  const years = data.map((d) => d.year);
  const values = data.map((d) => d.value);

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const minValue = Math.min(...values) * 0.9; // 10% buffer below
  const maxValue = Math.max(...values) * 1.1; // 10% buffer above

  const rangeYear = maxYear - minYear;
  const rangeValue = maxValue - minValue;

  // Map data to SVG coordinates
  const points = data.map((d) => {
    const x = paddingLeft + ((d.year - minYear) / rangeYear) * (chartWidth - paddingLeft - paddingRight);
    const y = chartHeight - paddingBottom - ((d.value - minValue) / rangeValue) * (chartHeight - paddingTop - paddingBottom);
    return { x, y, ...d };
  });

  // Build path string
  let pathD = '';
  points.forEach((p, idx) => {
    if (idx === 0) {
      pathD += `M ${p.x} ${p.y}`;
    } else {
      pathD += ` L ${p.x} ${p.y}`;
    }
  });

  // Y-axis grid values (4 lines)
  const gridLinesCount = 4;
  const gridValues = Array.from({ length: gridLinesCount }, (_, idx) => {
    return minValue + (rangeValue / (gridLinesCount - 1)) * idx;
  });

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Evolução do Patrimônio</Text>
      
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Horizontal Grid Lines & Y-axis Labels */}
          {gridValues.map((val, idx) => {
            const y = chartHeight - paddingBottom - ((val - minValue) / rangeValue) * (chartHeight - paddingTop - paddingBottom);
            return (
              <React.Fragment key={`grid-${idx}`}>
                <SvgLine
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <SvgText
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="end"
                >
                  {`R$ ${(val / 1000).toFixed(0)}k`}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* X-axis labels (Years) */}
          {points.map((p, idx) => {
            // Show start, middle, and end years to avoid overlap on small screens
            const isLabelVisible = idx === 0 || idx === Math.floor(points.length / 2) || idx === points.length - 1;
            if (!isLabelVisible) return null;

            return (
              <SvgText
                key={`year-${idx}`}
                x={p.x}
                y={chartHeight - 6}
                fill="#64748b"
                fontSize="10"
                textAnchor="middle"
              >
                {p.year.toString()}
              </SvgText>
            );
          })}

          {/* Line Path */}
          <Path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots on points */}
          {points.map((p, idx) => (
            <Circle
              key={`dot-${idx}`}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          ))}
        </Svg>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a', // slate-900
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
