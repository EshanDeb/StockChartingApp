var symbol=""
function getSymbol(symb){
	symbol=symb.toUpperCase();
	console.log(symbol)
}

function handleFiles(files) {
	console.log(files)
	// Check for the various File API support.
	if (window.FileReader) {
		// FileReader are supported.
		getAsText(files[0]);
	} else {
		alert('FileReader are not supported in this browser.');
	}
  }

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Read file into memory as UTF-8      
	reader.readAsText(fileToRead);
	// Handle errors load
	reader.onload = loadHandler;
}

function loadHandler(event) {
	var csv = event.target.result;
	processData(csv);
}

function processData(csv) {
	  var allTextLines = csv.split(/\r\n|\n/);
	  var lines = [];
	  for (var i=0; i<allTextLines.length; i++) {
		  var data = allTextLines[i].split(';');
			  var tarr = [];
			  for (var j=0; j<data.length; j++) {
				  tarr.push(data[j]);
			  }
			  lines.push(tarr);
	  }
	  getChart(lines.slice(1,));
}

function getChart(data){
	const chartProperties={
		height: window.innerHeight,
		width: window.innerWidth,
		overlay:true,
	}
	//console.log(window.innerHeight,window.innerWidth);
	const dmonth={'JAN':'01','FEB':'02','MAR':'03','APR':'04','MAY':'05','JUN':'06','JUL':'07','AUG':'08','SEP':'09','OCT':'10','NOV':'11','DEC':'12'}
	const domElement=document.getElementById('tvchart');
	const chart= LightweightCharts.createChart(domElement,chartProperties);
	const candleSeries1= chart.addCandlestickSeries();
	const cdata= ((data.filter(d => ((JSON.stringify(d)).split(',')).length>1 && ((JSON.stringify(d)).split(','))[3]==symbol)).map(d => {
		const arr=(JSON.stringify(d)).split(',');
		const month=dmonth[(arr[1].slice(3,6)).toUpperCase()]
		const date=arr[1].slice(7,)+'-'+month+'-'+arr[1].slice(0,2)
		//console.log(arr[3],{time:date, open:parseFloat(arr[4]), high:parseFloat(arr[5]), low:parseFloat(arr[6]), close: parseFloat(arr[7])})
		return {time:date, open:parseFloat(arr[4]), high:parseFloat(arr[5]), low:parseFloat(arr[6]), close: parseFloat(arr[7])}
	}))
	candleSeries1.setData(cdata);

	const pcrHistogram=chart.addHistogramSeries({
		title:"PCR",
		color: 'red',
		lineWidth: 2,
		overlay:true,
		scaleMargins: {
			top: 0,
			bottom: 0.9,
		},
	});

	const pcrData=((data.filter(d => ((JSON.stringify(d)).split(',')).length>1 && ((JSON.stringify(d)).split(','))[3]==symbol)).map(d => {
		const arr=(JSON.stringify(d)).split(',');
		const month=dmonth[(arr[1].slice(3,6)).toUpperCase()]
		const date=arr[1].slice(7,)+'-'+month+'-'+arr[1].slice(0,2)
		const factor=Math.pow(10,2)
		return {time:date, value:parseFloat(arr[9].slice(0,arr[9].indexOf(']')))*factor}
	}))
	pcrHistogram.setData(pcrData);

	const coiHistogram=chart.addHistogramSeries({
		title:"COI",
		color: 'green',
		lineWidth: 2,
		overlay:true,
		priceFormat: {
			type: 'volume',
		},
		scaleMargins: {
			top: 0.9,
			bottom: 0,
		},
	});

	const coiData=((data.filter(d => ((JSON.stringify(d)).split(',')).length>1 && ((JSON.stringify(d)).split(','))[3]==symbol)).map(d => {
		const arr=(JSON.stringify(d)).split(',');
		const month=dmonth[(arr[1].slice(3,6)).toUpperCase()]
		const date=arr[1].slice(7,)+'-'+month+'-'+arr[1].slice(0,2)
		return {time:date, value:parseFloat(arr[8])}
	}))
	coiHistogram.setData(coiData);	
}
