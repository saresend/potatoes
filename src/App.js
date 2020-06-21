import React, {useState, useEffect } from "react";
import * as d3 from "d3";
import "./App.css";
import { scaleLinear } from "d3-scale";
import styled from "styled-components";
import { Range } from 'react-range';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import ReactTooltip from 'react-tooltip';

function isReferencedInDataset(geo, sweetPotatoData, yearThreshold) {
	const threshold = yearThreshold[0];
	console.log("At year: ", threshold);
	if(!sweetPotatoData) {
		return 0;
	}
	var total = 0;
	const cmpString = geo.properties.NAME_1;
	for(var i = 0; i < sweetPotatoData.length; ++i) {
		if(sweetPotatoData[i].Province === cmpString && sweetPotatoData[i].Year <= threshold) {
			total = 1;
			break;
		}
	}
	return total;
}

function computeMinMax(sweetPotatoData) {
	if(!sweetPotatoData) {
		return [1000, 2000];
	}
	const yearList = sweetPotatoData.map((x) => parseInt(x.Year));

	console.log(yearList);
	const min_value = Math.min(...yearList);
	const max_value = Math.max(...yearList);
	console.log(min_value, max_value);
	return [min_value - 30, max_value + 30];
}
  const projection = d3
    .geoMercator()
    .center([70, 23])
    .scale([780])
    .translate([515, 550])
    .precision([0.1]);

  const colorScale = scaleLinear()
    .domain([0, 2])
    .range(["#ffedea", "#ff5233"]);


function App() {
  const geoURL =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/china/china-provinces.json";
	const [ sweetPotatoData, setSweetPotatoData ] = useState();
	const [ cornData, setCornData ] = useState();
	const [ isPotatoData, setPotatoData ] = useState(true);
	const [ yearThreshold, setYearThreshold ] = useState([1600]);

	useEffect(() => {
		d3.csv("potato_data.csv").then((data) => {
			setSweetPotatoData(data);
		});
	}, []);

	useEffect(() => {
		d3.csv("corn_data.csv").then((data) => {
			setCornData(data);
		});
	}, []);
	const currDataset = isPotatoData ? sweetPotatoData : cornData;

	const [yearMin, yearMax] = computeMinMax(currDataset);
	const [tooltipContent, setTooltipContent] = useState("");

  return (
		<Container>
		<Heading>
		<Title><CenterText> Potato Data - Visualized tho </CenterText></Title>
		</Heading>
			<Range
        step={5}
        min={yearMin}
        max={yearMax}
        values={yearThreshold}
        onChange={values => setYearThreshold(values)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              width: '50%',
              backgroundColor: '#eee'
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
              height: '30px',
              width: '30px',
							borderWidth: '3px',
							borderStyle: 'solid',
							borderRadius: '30px',
							borderColor: "#ffb4a2", 
							stroke: '#ffb4a2',
              backgroundColor: '#ffffff'
            }}
          />
        )}
      />
		<SliderInfo> Current Year: {yearThreshold[0]} </SliderInfo>
    <ComposableMap projection={projection} width={window.innerWidth} height={600}>
      <Geographies geography={geoURL}>
        {({ geographies }) =>
          geographies.map((geo) => {
						const isReferenced = isReferencedInDataset(geo, currDataset, yearThreshold);
            return (
              <Geography
                fill={colorScale(isReferenced)}
                key={geo.rsmKey}
                geography={geo}
								onMouseEnter={() => {
										const {NAME_1} = geo.properties;
										console.log(NAME_1);
										setTooltipContent(`Region: ${NAME_1}`);
								}}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
		<ReactTooltip>{tooltipContent}</ReactTooltip>
		</Container>
  );
}

const Title = styled.div`
 display: flex;
`;

const SliderInfo = styled.div`
	margin: 30px;
	font-size: 30px;
	font-color: darkgrey;

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
