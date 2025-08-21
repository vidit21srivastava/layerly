// Infill slider value update
const infillSlider = document.getElementById('infill');
const infillValue = document.getElementById('infillValue');

infillSlider.addEventListener('input', function() {
  infillValue.textContent = `${this.value}%`;
});

// Color palette selection
const colorSwatches = document.querySelectorAll('.color-swatch');
const selectedColorInput = document.getElementById('selectedColor');

colorSwatches.forEach(swatch => {
  swatch.addEventListener('click', () => {
    // Remove border highlight from all
    colorSwatches.forEach(s => s.style.borderColor = '#ddd');
    // Highlight selected
    swatch.style.borderColor = '#ffa800';
    // Update hidden input
    selectedColorInput.value = swatch.getAttribute('data-color');
  });
});

// Initialize first color as selected
if (colorSwatches.length > 0) {
  colorSwatches[0].style.borderColor = '#ffa800';
}

document.addEventListener('DOMContentLoaded', function() {
  // Form elements
  const form = document.getElementById('customForm');
  const stlInput = document.getElementById('stlFile');
  const fileName = document.getElementById('fileName');

  // 3D Viewer Setup
  let scene, camera, renderer, controls;
  let currentMesh = null; // Track current model

  function initSTLViewer() {
    const container = document.getElementById('stlViewer');
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = ''; // Clear previous canvas
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add resize observer for the preview section
    const previewSection = document.querySelector('.preview-section');
    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(previewSection);

    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  function loadSTLPreview(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Clear previous model
      if (currentMesh) scene.remove(currentMesh);

      // Load STL
      const loader = new THREE.STLLoader();
      const geometry = loader.parse(e.target.result);
      
      // Material
      const material = new THREE.MeshPhongMaterial({
        color: 0xffa800,
        specular: 0x111111,
        shininess: 200,
        side: THREE.DoubleSide
      });

      currentMesh = new THREE.Mesh(geometry, material);

      // Center and scale
      const box = new THREE.Box3().setFromObject(currentMesh);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);
      const scale = 50 / maxSize;
      
      currentMesh.position.sub(center); // Center at origin
      currentMesh.scale.set(scale, scale, scale);
      
      scene.add(currentMesh);

      // Position camera
      camera.position.set(0, 0, maxSize * 2);
      camera.lookAt(0, 0, 0);
      controls.update();
    };

    reader.readAsArrayBuffer(file);
  }

  // Initialize viewer
  initSTLViewer();

  // File upload handler
  stlInput.addEventListener('change', function() {
    fileName.textContent = this.files[0]?.name || 'No file selected';
    if (this.files[0]) loadSTLPreview(this.files[0]);
  });

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic validation
    if (!stlInput.files[0]) {
      alert('Please upload an STL file first!');
      return;
    }

    // Get form data
    const formData = {
      stlFile: stlInput.files[0].name,
      material: document.getElementById('material').value,
      layerHeight: document.getElementById('layerHeight').value,
      infill: document.getElementById('infill').value,
      infillPattern: document.getElementById('infillPattern').value,
      supports: document.getElementById('supports').checked,
      instructions: document.getElementById('instructions').value,
      color: document.getElementById('selectedColor').value
    };

    console.log('Quote request data:', formData);

    // Redirect to quote.html
    window.location.href = 'quote.html';
  });
});
