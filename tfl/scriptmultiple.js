window.addEventListener('load', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    // Configurar el tamaño del canvas
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 100;

    let isDrawing = false;
    let startX, startY;
    let tool = 'free'; // free, line, rectangle, circle

    // Guardar el contenido del canvas
    let bufferCanvas = document.createElement('canvas');
    let bufferCtx = bufferCanvas.getContext('2d');
    bufferCanvas.width = canvas.width;
    bufferCanvas.height = canvas.height;

    function startPosition(e) {
        isDrawing = true;
        startX = e.clientX - canvas.getBoundingClientRect().left;
        startY = e.clientY - canvas.getBoundingClientRect().top;

        if (tool === 'free') {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
        }
    }

    function endPosition() {
        if (tool === 'line') {
            drawLine(startX, startY, startX, startY);
        } else if (tool === 'rectangle') {
            drawRectangle(startX, startY, startX, startY);
        } else if (tool === 'circle') {
            drawCircle(startX, startY, startX, startY);
        }
        isDrawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tool === 'free') {
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (tool === 'line') {
            drawPreviewLine(startX, startY, x, y);
        } else if (tool === 'rectangle') {
            drawPreviewRectangle(startX, startY, x, y);
        } else if (tool === 'circle') {
            drawPreviewCircle(startX, startY, x, y);
        }
    }

    function drawPreviewLine(x1, y1, x2, y2) {
        bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
        bufferCtx.drawImage(canvas, 0, 0); // Redibujar contenido almacenado
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas actual
        ctx.drawImage(bufferCanvas, 0, 0);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'gray';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function drawPreviewRectangle(x1, y1, x2, y2) {
        bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
        bufferCtx.drawImage(canvas, 0, 0); // Redibujar contenido almacenado
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas actual
        ctx.drawImage(bufferCanvas, 0, 0);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 2;
        ctx.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
    }

    function drawPreviewCircle(x1, y1, x2, y2) {
        bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
        bufferCtx.drawImage(canvas, 0, 0); // Redibujar contenido almacenado
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas actual
        ctx.drawImage(bufferCanvas, 0, 0);
        const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x1, y1, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawLine(x1, y1, x2, y2) {
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        bufferCtx.drawImage(canvas, 0, 0); // Actualizar buffer
    }

    function drawRectangle(x1, y1, x2, y2) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
        bufferCtx.drawImage(canvas, 0, 0); // Actualizar buffer
    }

    function drawCircle(x1, y1, x2, y2) {
        const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(x1, y1, radius, 0, Math.PI * 2);
        ctx.stroke();
        bufferCtx.drawImage(canvas, 0, 0); // Actualizar buffer
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
    }

    document.getElementById('lineButton').addEventListener('click', () => {
        tool = 'line';
    });

    document.getElementById('rectangleButton').addEventListener('click', () => {
        tool = 'rectangle';
    });

    document.getElementById('circleButton').addEventListener('click', () => {
        tool = 'circle';
    });

    document.getElementById('clearButton').addEventListener('click', clearCanvas);

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
});
