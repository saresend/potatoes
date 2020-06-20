import React, {useState, useEffect } from "react";
import * as d3 from "d3";
import "./App.css";
import { scaleLinear } from "d3-scale";
import styled from "styled-components";
import { Range } from 'react-range';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

function isReferencedInDataset(geo, sweetPotatoData) {
	if(!sweetPotatoData) {
		return 0;
	}
	var total = 0;
	const cmpString = geo.properties.NAME_1;
	for(var i = 0; i < sweetPotatoData.length; ++i) {
		if(sweetPotatoData[i].Province === cmpString) {
			total = 1;
			break;
		}
	}
	return total;
}

function App() {
  const geoURL =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/china/china-provinces.json";
  const projection = d3
    .geoMercator()
    .center([90, 23])
    .scale([750])
    .translate([515, 550])
    .precision([0.1]);

	const [ sweetPotatoData, setSweetPotatoData ] = useState();
	const [ cornData, setCornData ] = useState();
	const [ yearThreshold, setYearThreshold ] = useState([0]);

	useEffect(() => {
		d3.csv("potato_data.csv").then((data) => {
			setSweetPotatoData(data);
		});
	}, []);

	useEffect(() => {
		d3.csv("potato_data.csv").then((data) => {
			setSweetPotatoData(data);
		});
	}, []);
		

  const colorScale = scaleLinear()
    .domain([0, 2])
    .range(["#ffedea", "#ff5233"]);

  return (
		<Container>
		<Heading>
		<Title> <CenterText> Potato Data - Visualized tho </CenterText></Title>
		</Heading>

			<Range
        step={0.1}
        min={0}
        max={100}
        values={yearThreshold}
        onChange={values => setYearThreshold(values)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              width: '50%',
              backgroundColor: '#ccc'
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '42px',
              width: '42px',
              backgroundColor: '#999'
            }}
          />
        )}
      />
    <ComposableMap projection={projection} width={window.innerWidth} height={600}>
      <Geographies geography={geoURL}>
        {({ geographies }) =>
          geographies.map((geo) => {
						const isReferenced = isReferencedInDataset(geo, sweetPotatoData);
            return (
              <Geography
                fill={colorScale(isReferenced)}
                key={geo.rsmKey}
                geography={geo}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
		</Container>
  );
}

const Title = styled.div`
 display: flex;
`;

const CenterText = styled.p`
	text-align: center;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Heading = styled.div`
	display: flex;
	padding: 20px;
	padding-left: 500px;
	padding-right: 500px;
`;

export default App;
