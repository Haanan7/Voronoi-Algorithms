document.getElementById('numPoints').addEventListener('input', function() {
    const numPoints = parseInt(this.value) || 0;
    const pointsInput = document.getElementById('pointsInput');
    pointsInput.innerHTML = ''; // Clear existing inputs

    for (let i = 0; i < numPoints; i++) {
        pointsInput.innerHTML += `
            <div>
                <label>Point ${i + 1} (x, y):</label>
                <input type="number" step="any" class="form-control" placeholder="x" required>
                <input type="number" step="any" class="form-control" placeholder="y" required>
            </div>
        `;
    }
});

document.getElementById('generateButton').addEventListener('click', function() {
    const points = [];
    const inputs = document.querySelectorAll('#pointsInput div');

    // Collect points from input fields
    inputs.forEach(inputDiv => {
        const x = parseFloat(inputDiv.querySelector('input[placeholder="x"]').value);
        const y = parseFloat(inputDiv.querySelector('input[placeholder="y"]').value);
        points.push({ x, y });
    });

    // Generate Voronoi Diagram
    const voronoi = new Voronoi();
    const bbox = { xl: 0, xr: 600, yt: 400, yb: 0 }; // Canvas size
    const diagram = voronoi.compute(points, bbox);

    // Clear the canvas for new drawing
    const canvas = document.getElementById('voronoiCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges of the Voronoi diagram
    context.strokeStyle = '#000';
    diagram.edges.forEach(edge => {
        const start = edge.va;
        const end = edge.vb;

        // Ensure vertices are within the bounding box
        if (start && end) {
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.stroke();
        }
    });

    // Display results of Voronoi regions
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h2>Voronoi Regions</h2>`;
    diagram.cells.forEach((cell, index) => {
        const site = cell.site;
        resultsDiv.innerHTML += `<h3>Region #${index + 1}: Site (${site.x}, ${site.y})</h3>`;
        cell.halfedges.forEach(edgeIndex => {
            const edge = diagram.edges[edgeIndex];
            const vertex = edge.va;
            resultsDiv.innerHTML += `<p>Vertex (${vertex.x}, ${vertex.y})</p>`;
        });
    });
});