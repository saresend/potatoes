import React from "react";
import * as d3 from "d3";
import "./App.css";
import styled from "styled-components";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

function App() {
  const geoURL =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/china/china-provinces.json";
  const projection = d3
    .geoMercator()
    .center([120, 23])
    .scale([450])
    .translate([515, 550])
    .precision([0.1]);
  return (
    <ComposableMap projection={projection}>
      <Geographies geography={geoURL}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}

export default App;
