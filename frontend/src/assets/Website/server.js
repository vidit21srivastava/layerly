const express = require('express');
const fileUpload = require('express-fileupload');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(fileUpload());
app.use(express.static('public')); // Serve your frontend

// Endpoint to handle slicing
app.post('/slice', (req, res) => {
  if (!req.files?.stl) return res.status(400).json({ error: 'No STL file uploaded' });

  const stlFile = req.files.stl;
  const uploadDir = path.join(__dirname, 'uploads');
  const stlPath = path.join(uploadDir, `${Date.now()}.stl`);
  const outputPath = path.join(uploadDir, `${Date.now()}.gcode`);

  // Save uploaded file
  stlFile.mv(stlPath, (err) => {
    if (err) return res.status(500).json({ error: 'File upload failed' });

    // CuraEngine command with parameters from the frontend
    const layerHeight = req.body.layerHeight || 0.2;
    const infill = req.body.infill || 20;
    
    const command = `
      CuraEngine slice \
      -j "C:\\Program Files\\Ultimaker Cura 5.8.0\\resources\\definitions\\fdmprinter.def.json" \
      -s layer_height=${layerHeight} \
      -s infill_sparse_density=${infill} \
      -l ${stlPath} \
      -o ${outputPath}
    `;

    exec(command, (error) => {
      if (error) {
        console.error('Slicing failed:', error);
        return res.status(500).json({ error: 'Slicing failed' });
      }

      // Parse G-code for statistics
      const gcode = fs.readFileSync(outputPath, 'utf8');
      const time = gcode.match(/TIME_ELAPSED:(\d+)/)?.[1];
      const material = gcode.match(/Filament used: ([\d.]+)m/)?.[1];

      // Cleanup files
      fs.unlinkSync(stlPath);
      fs.unlinkSync(outputPath);

      res.json({ time, material });
    });
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));

