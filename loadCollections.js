function createElementWithName(tag, name) {
	var elem = document.createElement(tag)
	var text = document.createTextNode(name)
	elem.appendChild(text)
	return elem;
}

function createRow(tag, cells, link = null) {
	var row = document.createElement('tr')
	for(let i = 0; i < cells.length; ++i) {
		var cell = null;
		if(i == 0 && link != null) {
			cell = document.createElement(tag)
			var anchor = document.createElement('a')
			var text = document.createTextNode(cells[i])
			anchor.href = link
			anchor.appendChild(text)
			cell.appendChild(anchor)
		}
		else cell = createElementWithName(tag, cells[i])
		row.appendChild(cell)
	}
	return row
}

function getDefaultTable() {
	var table = document.createElement('table');
	table.classList.add('beatmaps')
	const row = createRow('th', ['Title', 'Artist', 'Difficulty', 'SR', 'BPM', 'Length', 'AR', 'HP', 'CS', 'OD'])
	table.appendChild(row)
	return table
}

function floatFormat(value, zeros) {
	const num = (Math.round(Number(value) * Math.pow(10, zeros)) / Math.pow(10, zeros)).toFixed(zeros);
	return num.toString()
}

function timeFormat(value) {
	var num = Number(value)
	const hours = Math.floor(num / 3600)
	num -= hours * 3600
	const minutes = Math.floor(num / 60)
	num -= minutes * 60
	var seconds = num
	if(seconds < 10) seconds = '0' + seconds.toString()
	else seconds = seconds.toString()
	if(hours > 0) return hours.toString() + ':' + minutes.toString() + ':' + seconds
	return minutes.toString() + ':' + seconds
}

window.onload = function () {
	var collectionsDiv = document.getElementById('collections')
	var summaryList = document.getElementById('summarylist')

	fetch('collections.json')
	.then(response => response.json())
	.then(data => {
		for(let i = 0; i < data.collections.length; ++i) {
			const fileName = data.collections[i]
			fetch('./collections/' + fileName)
			.then(response => response.json())
			.then(data => {
				const nameHeader = document.createElement('h2')
				nameHeader.appendChild(document.createTextNode(data.name))
				nameHeader.classList.add('collectionName')
				nameHeader.id = data.name
				collectionsDiv.appendChild(nameHeader)

				data.beatmaps.sort(function(a, b) {
					return parseFloat(a.sr) - parseFloat(b.sr);
				});

				const table = getDefaultTable()

				for(let i = 0; i < data.beatmaps.length; ++i) {
					const beatmap = data.beatmaps[i]
					const row = createRow('td', [
						beatmap.title,
						beatmap.artist,
						beatmap.difficulty,
						floatFormat(beatmap.sr, 2),
						floatFormat(beatmap.bpm, 0),
						timeFormat(beatmap.length),
						floatFormat(beatmap.ar, 1), 
						floatFormat(beatmap.hp, 1), 
						floatFormat(beatmap.cs, 1), 
						floatFormat(beatmap.od, 1),
					], beatmap.url)
					table.appendChild(row)
				}

				collectionsDiv.appendChild(table)

				var listelem = document.createElement('li')
				var anchor = document.createElement('a')
				anchor.appendChild(document.createTextNode(data.name))
				anchor.href = '#'+data.name
				listelem.appendChild(anchor)
				summaryList.appendChild(listelem)

				console.log(fileName + " Loaded!")
			})
			.catch(error => console.log(error));
		}
	})
	.catch(error => console.log(error))
}
