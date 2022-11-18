import React, { PureComponent } from "react";
import {
  PieChart, Pie, Sector, ResponsiveContainer, Cell
} from "recharts";

const renderActiveShape = (props: {
    cx: any; cy: any; midAngle: any; innerRadius: any; outerRadius: any; startAngle: any;
    endAngle: any; fill: any; payload: any; percent: any; value: any;}) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill,
    payload, percent, value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} articles`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default class RegionsPieChart extends PureComponent<{
  regions: { name: string; number: number; }[]
} > {
  COLORS = ["#0090A4", "#58CDBD", "#9D4993", "#36AD89"];

  // regions1 = [
  //   { name: "Great Britain", number: 20 },
  //   { name: "Germany", number: 35 },
  //   { name: "France", number: 12 },
  //   { name: "Italy", number: 28 },
  //   { name: "Hungary", number: 15 },
  //   { name: "Poland", number: 45 },
  //   { name: "Czech Republic", number: 10 },
  // ];

  constructor(props: any) {
    super(props);

    this.state = {
      activeIndex: 0
    };
  }

  onPieEnter = (_: any, index: any) => {
    this.setState({
      activeIndex: index,
    });
  };

  override render() {
    const { activeIndex }: any = this.state;
    const { regions = [] } = this.props;

    console.log(regions);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={300} height={300}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={regions}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            fill="#8884d8"
            dataKey="number"
            onMouseEnter={this.onPieEnter}
          >
            {regions.map((entry: any, index: number) => (
              <Cell key={`cell-${entry}`} fill={this.COLORS[index % this.COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
