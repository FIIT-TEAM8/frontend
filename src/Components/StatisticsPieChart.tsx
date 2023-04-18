import React, { PureComponent } from "react";
import {
  Grid,
  Button,
  Typography,
  Modal,
  Box
} from "@mui/material";
import {
  PieChart, Pie, Sector, ResponsiveContainer, Cell
} from "recharts";
import { NavigateFunction } from "react-router-dom";

const renderActiveShape = (props: {
    cx: any; cy: any; midAngle: any; innerRadius: any; outerRadius: any; startAngle: any;
    endAngle: any; fill: any; payload: any; percent: any; value: any;}) => {
  // const RADIAN = Math.PI / 180;
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill,
    payload, value
  } = props;
  // const sin = Math.sin(-RADIAN * midAngle);
  // const cos = Math.cos(-RADIAN * midAngle);
  // const sx = cx + (outerRadius + 10) * cos;
  // const sy = cy + (outerRadius + 10) * sin;
  // const mx = cx + (outerRadius + 30) * cos;
  // const my = cy + (outerRadius + 30) * sin;
  // const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  // const ey = my;
  // const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy - 11} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 11} dy={8} textAnchor="middle" fill="#757575">
        {`${value} articles`}
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
      {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text> */}
    </g>
  );
};

export default class RegionsPieChart extends PureComponent<{
  data: { regions: any; searchParams: URLSearchParams; navigate: NavigateFunction }
} > {
  COLORS = ["#0090A4", "#58CDBD", "#9D4993", "#36AD89"];

  constructor(props: any) {
    super(props);

    this.state = {
      activeIndex: 0,
      open: false
    };
  }

  onPieEnter = (_: any, index: any) => {
    this.setState({
      activeIndex: index
    });
  };

  setOpen = (isOpen: boolean) => {
    this.setState({
      open: isOpen
    });
  };

  override render() {
    const { activeIndex }: any = this.state;
    const { data } = this.props;
    const { open }: any = this.state;
    const handleOpen = () => this.setOpen(true);
    const handleClose = () => this.setOpen(false);

    const showArticlesFromGraph: any = (e: any) => {
      data.searchParams.append("page", `${1}`);
      data.searchParams.append("ids", `[${e.articlesIDs}]`);

      handleOpen();
    };

    const showArticlesByIDs = () => {
      data.navigate(`/stats?${data.searchParams.toString()}`);
    };

    return (
      <div>
        <ResponsiveContainer width="99%" height={300}>
          <PieChart width={300} height={300}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data.regions}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={this.onPieEnter}
              onClick={showArticlesFromGraph}
            >
              {data.regions.map((entry: any, index: number) => (
                <Cell key={`cell-${entry}`} fill={this.COLORS[index % this.COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            px: 4,
            pb: 3,
            textAlign: "center"
          }}
          >
            <Typography sx={{ mt: 2, textAlign: "center" }}>
              Do you want to show related articles?
            </Typography>
            <Grid container spacing={3} justifyContent="center" style={{ textAlign: "center" }}>
              <Grid item>
                <Button
                  color="info"
                  variant="text"
                  style={{
                    textAlign: "center",
                    width: "30%",
                    backgroundColor: "rgb(38, 166, 154)",
                    marginBottom: "10px",
                    marginTop: "30px"
                  }}
                  onClick={showArticlesByIDs}
                >
                  Yes
                </Button>
              </Grid>
              <Grid item>
                <Button
                  sx={{
                    textAlign: "center",
                    width: "30%",
                    marginTop: "30px",
                    marginBottom: "10px"
                  }}
                  onClick={handleClose}
                >
                  No
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>
    );
  }
}
