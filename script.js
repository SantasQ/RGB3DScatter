
function getParameterByName(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

fetch("All_Images_RGB_Data.csv")
    .then(response => {
        if (!response.ok) throw new Error("CSV file not found or failed to load.");
        return response.text();
    })
    .then(csvText => {
        const imageName = getParameterByName("image");
        if (!imageName) {
            document.getElementById("visualization").innerHTML = "<p style='color:red'>No image name provided.</p>";
            return;
        }

        const lines = csvText.split("\n");
        const headers = lines[0].split(",");
        const data = [];
        let foundCount = 0;

        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(",");
            if (row.length < 7) continue;
            if (row[6].trim() === imageName.trim()) {
                const r = parseInt(row[3]);
                const g = parseInt(row[4]);
                const b = parseInt(row[5]);
                data.push({
                    x: r,
                    y: g,
                    z: b,
                    color: `rgb(${r},${g},${b})`
                });
                foundCount++;
            }
        }

        if (foundCount === 0) {
            document.getElementById("visualization").innerHTML = `<p style='color:red'>No data found for image: <strong>${imageName}</strong></p>`;
            return;
        }

        console.log("Image:", imageName, "| Points plotted:", foundCount);

        const container = document.getElementById("visualization");
        const graphData = new vis.DataSet(data);
        new vis.Graph3d(container, graphData, {
            width: "800px",
            height: "600px",
            style: "dot", // ← color指定が効く安定構成
            showPerspective: true,
            showGrid: true,
            keepAspectRatio: true,
            verticalRatio: 1.0,
            cameraPosition: {
                horizontal: 1.0,
                vertical: 0.5,
                distance: 1.8
            }
        });
    })
    .catch(err => {
        console.error("Error loading or parsing CSV:", err);
        document.getElementById("visualization").innerHTML = "<p style='color:red'>Error loading data.</p>";
    });
