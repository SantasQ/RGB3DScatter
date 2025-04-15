
function getParameterByName(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

fetch("All_Images_RGB_Data.csv")
    .then(response => response.text())
    .then(csvText => {
        const imageName = getParameterByName("image");
        const lines = csvText.split("\n");
        const headers = lines[0].split(",");
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(",");
            if (row.length < 7) continue;
            if (row[6] === imageName) {
                const r = parseInt(row[3]);
                const g = parseInt(row[4]);
                const b = parseInt(row[5]);
                data.push({
                    x: r,
                    y: g,
                    z: b,
                    style: `rgb(${r},${g},${b})`
                });
            }
        }

        const container = document.getElementById("visualization");
        const graphData = new vis.DataSet(data);
        new vis.Graph3d(container, graphData, {
            width: "800px",
            height: "600px",
            style: "dot-color",
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
    });
