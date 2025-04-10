import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Palette, Eraser, Download, RotateCcw, Info } from 'lucide-react';

interface ColorPalette {
  name: string;
  colors: string[];
}

const Coloring: React.FC = () => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const colorPalettes: ColorPalette[] = [
    {
      name: 'Nature',
      colors: ['#2E7D32', '#388E3C', '#43A047', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9']
    },
    {
      name: 'Ocean',
      colors: ['#0288D1', '#039BE5', '#03A9F4', '#29B6F6', '#4FC3F7', '#81D4FA', '#B3E5FC', '#E1F5FE']
    },
    {
      name: 'Sunset',
      colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#00BCD4', '#009688']
    },
    {
      name: 'Earth',
      colors: ['#795548', '#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8', '#EFEBE9', '#DCE775', '#CDDC39']
    }
  ];

  // Initialize the canvas when the component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Get the canvas context and configure it
    const context = canvas.getContext('2d');
    if (context) {
      context.lineCap = 'round';
      context.strokeStyle = selectedColor;
      context.lineWidth = lineWidth;
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      contextRef.current = context;
    }
  }, []);

  // Update the stroke style when the selected color changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = isEraser ? '#FFFFFF' : selectedColor;
    }
  }, [selectedColor, isEraser]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setIsEraser(false);
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  };

  const handleEraserClick = () => {
    setIsEraser(true);
    if (contextRef.current) {
      contextRef.current.strokeStyle = '#FFFFFF';
    }
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (canvas && context) {
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'coloring-artwork.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mind-soothing')}
            className="flex items-center text-amber-600 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="font-bold text-xl text-amber-800 flex items-center">
            <Palette className="h-6 w-6 mr-2" />
            Therapeutic Coloring
          </h1>
          <button
            onClick={() => setShowInfo(true)}
            className="text-amber-600 hover:text-amber-800"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Canvas Area */}
            <div className="md:col-span-2">
              <div className="aspect-square bg-white border-2 border-amber-200 rounded-lg">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-full"
                  style={{ cursor: isEraser ? 'cell' : 'crosshair' }}
                />
              </div>
            </div>

            {/* Tools Panel */}
            <div className="space-y-6">
              {/* Color Palettes */}
              {colorPalettes.map((palette, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-sm font-medium text-amber-800">{palette.name}</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {palette.colors.map((color, colorIndex) => (
                      <button
                        key={colorIndex}
                        onClick={() => handleColorSelect(color)}
                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-amber-600' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Brush Size Slider */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-amber-800">Brush Size</h3>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={lineWidth}
                  onChange={(e) => {
                    const width = parseInt(e.target.value);
                    setLineWidth(width);
                    if (contextRef.current) {
                      contextRef.current.lineWidth = width;
                    }
                  }}
                  className="w-full"
                />
              </div>

              {/* Tools */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={handleEraserClick}
                    className={`p-2 rounded-lg ${isEraser ? 'bg-amber-100' : 'hover:bg-amber-50'}`}
                  >
                    <Eraser className="h-6 w-6 text-amber-600" />
                  </button>
                  <button
                    onClick={handleClearCanvas}
                    className="p-2 rounded-lg hover:bg-amber-50"
                  >
                    <RotateCcw className="h-6 w-6 text-amber-600" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg hover:bg-amber-50"
                  >
                    <Download className="h-6 w-6 text-amber-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-amber-800 mb-4">Benefits of Therapeutic Coloring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">Stress Reduction</h3>
                <p className="text-amber-700">
                  Coloring helps focus the mind and reduce anxiety by providing a calming, meditative activity.
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">Improved Focus</h3>
                <p className="text-amber-700">
                  The concentration required for coloring can help improve attention span and cognitive function.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">Creative Expression</h3>
                <p className="text-amber-700">
                  Coloring provides a safe and accessible way to express creativity and emotions.
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">Mindfulness Practice</h3>
                <p className="text-amber-700">
                  The repetitive nature of coloring can help achieve a state of mindfulness and relaxation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-800">How to Use the Coloring Tool</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-amber-600 hover:text-amber-800"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-amber-700">
              <p>
                This therapeutic coloring tool is designed to help you relax and focus. Here's how to use it:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Select a color from the palettes on the right</li>
                <li>Adjust the brush size using the slider</li>
                <li>Click and drag on the canvas to draw</li>
                <li>Use the eraser tool to correct mistakes</li>
                <li>Clear the canvas to start over</li>
                <li>Download your artwork to save it</li>
              </ul>
              <p className="italic">
                Take your time and enjoy the process. There's no right or wrong way to color!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coloring; 