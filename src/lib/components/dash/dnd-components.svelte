<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { nodeDefinitions } from '$lib/stores/node-store';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import ActivityPanel from './activity-panel.svelte';
	import Panel from './panel.svelte';
	import CreateButton from './create-button.svelte';

	// Get project ID from the URL
	let currentProjectId = $derived($page.params.projectId || '');

	// Set up a container ref
	let container;
	let canvas;

	// Manual pan-zoom state
	let scale = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let isPanning = $state(false);
	let lastPanPoint = $state({ x: 0, y: 0 });
	let minZoom = 0.05; // Allow zooming out much further
	let maxZoom = 3;
	let zoomStep = 0.1;

	// Track if we're currently interacting with a node
	let isNodeInteraction = $state(false);

	// Node boundary tracking
	let minX = $state(0);
	let minY = $state(0);
	let maxX = $state(0);
	let maxY = $state(0);
	let nodeSize = { width: 350, height: 300 }; // Approximate size of nodes

	// Load nodes from the database
	async function loadNodesFromDB() {
		try {
			const response = await fetch(
				`/api/nodes/position?projectId=${encodeURIComponent(currentProjectId)}`
			);
			const data = await response.json();

			if (data.success && data.nodes) {
				// Clear existing nodes
				nodeDefinitions.set([]);

				// Add nodes from the database
				data.nodes.forEach((node) => {
					nodeDefinitions.update((nodes) => [
						...nodes,
						{
							id: node.id,
							type: node.type,
							position: node.position,
							data: node.configuration
						}
					]);
				});

				// After loading nodes, calculate boundaries and auto-fit
				setTimeout(calculateBoundaries, 100);
			}
		} catch (error) {
			console.error('Error loading nodes:', error);
		}
	}

	// Calculate boundaries of all nodes
	function calculateBoundaries() {
		if ($nodeDefinitions.length === 0) return;

		// Initialize with first node position
		minX = $nodeDefinitions[0].position.x;
		minY = $nodeDefinitions[0].position.y;
		maxX = $nodeDefinitions[0].position.x + nodeSize.width;
		maxY = $nodeDefinitions[0].position.y + nodeSize.height;

		// Find min/max coordinates of all nodes
		$nodeDefinitions.forEach((node) => {
			minX = Math.min(minX, node.position.x);
			minY = Math.min(minY, node.position.y);
			maxX = Math.max(maxX, node.position.x + nodeSize.width);
			maxY = Math.max(maxY, node.position.y + nodeSize.height);
		});

		console.log(`Node boundaries: (${minX}, ${minY}) to (${maxX}, ${maxY})`);

		// Auto-fit all nodes
		autoFit();
	}

	// Auto-fit to show all nodes
	function autoFit() {
		if (!container || $nodeDefinitions.length === 0) return;

		// Add padding
		const padding = 100;
		const boundaryWidth = maxX - minX + padding * 2;
		const boundaryHeight = maxY - minY + padding * 2;

		// Get container dimensions
		const containerWidth = container.clientWidth;
		const containerHeight = container.clientHeight;

		// Calculate scale to fit
		const scaleX = containerWidth / boundaryWidth;
		const scaleY = containerHeight / boundaryHeight;
		scale = Math.min(scaleX, scaleY, 1); // Don't zoom in more than 1x on auto-fit

		// Center the content
		panX = containerWidth / 2 - ((minX + maxX) / 2) * scale;
		panY = containerHeight / 2 - ((minY + maxY) / 2) * scale;

		console.log(`Auto-fit: scale=${scale}, pan=(${panX}, ${panY})`);
	}

	// Handle position updates for nodes
	// Function to check if an element is a node or child of a node
	function isNodeElement(element) {
		if (!element) return false;

		// Check if element or any parent has node-related classes
		const nodeClasses = [
			'draggable-item',
			'nodeWrapper',
			'platform-node',
			'campaign-node',
			'table-node',
			'db-table'
		];

		// Follow up the DOM tree to check for node elements
		let currentElement = element;
		for (let i = 0; i < 6; i++) {
			// Check up to 6 levels up
			if (!currentElement) break;

			// Check element's classes
			if (currentElement.classList) {
				for (const cls of nodeClasses) {
					if (currentElement.classList.contains(cls)) {
						return true;
					}
				}
			}

			// Move up to parent
			currentElement = currentElement.parentElement;
		}

		return false;
	}

	// Capture mousedown on nodes to prevent canvas panning
	function handleNodeMouseDown(event) {
		if (isNodeElement(event.target)) {
			isNodeInteraction = true;

			// Mark this as a node interaction so canvas doesn't try to pan
			event._isNodeInteraction = true;
		}
	}

	// Handle canvas mouse down
	function handleCanvasMouseDown(event) {
		// Only pan if clicking directly on canvas (not nodes)
		// Using stopPropagation() in the node mousedown handler doesn't work well with the
		// Draggable component, so we use our own flag system instead
		if (!event._isNodeInteraction && !isNodeElement(event.target)) {
			isPanning = true;
			lastPanPoint = { x: event.clientX, y: event.clientY };
			container.style.cursor = 'grabbing';
		}
	}

	function handleTouchStart(event) {
		// Check if touch is on a node
		if (isNodeElement(event.target)) {
			isNodeInteraction = true;
			return;
		}

		// Only pan if touching directly on canvas
		if (event.target === canvas || event.target === container) {
			isPanning = true;
			const touch = event.touches[0];
			lastPanPoint = { x: touch.clientX, y: touch.clientY };
			// Don't prevent default for all touch events to allow node dragging
			if (event.target === canvas || event.target === container) {
				event.preventDefault();
			}
		}
	}

	function handleMouseMove(event) {
		if (isPanning) {
			const dx = event.clientX - lastPanPoint.x;
			const dy = event.clientY - lastPanPoint.y;

			panX += dx;
			panY += dy;

			lastPanPoint = { x: event.clientX, y: event.clientY };
			event.preventDefault();
		}
	}

	function handleTouchMove(event) {
		if (isPanning) {
			const touch = event.touches[0];
			const dx = touch.clientX - lastPanPoint.x;
			const dy = touch.clientY - lastPanPoint.y;

			panX += dx;
			panY += dy;

			lastPanPoint = { x: touch.clientX, y: touch.clientY };
			event.preventDefault();
		}
	}

	function handleMouseUp() {
		if (isPanning) {
			isPanning = false;
			container.style.cursor = 'grab';
		}
		isNodeInteraction = false;
	}

	function handleTouchEnd() {
		if (isPanning) {
			isPanning = false;
		}
		isNodeInteraction = false;
	}

	function handleWheel(e) {
		e.preventDefault();

		// Calculate where to zoom (under mouse cursor)
		const rect = container.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		// Calculate point in non-scaled coordinates
		const pointX = (mouseX - panX) / scale;
		const pointY = (mouseY - panY) / scale;

		// Determine zoom direction
		const delta = e.deltaY < 0 ? 1 : -1;
		// Make zoom steps proportional to current scale for smoother zooming at extremes
		const effectiveZoomStep = zoomStep * (delta > 0 ? 1 : scale);
		const newScale = Math.max(minZoom, Math.min(maxZoom, scale + delta * effectiveZoomStep));

		// Set new scale
		scale = newScale;

		// Adjust pan to zoom at cursor position
		panX = mouseX - pointX * newScale;
		panY = mouseY - pointY * newScale;
	}

	function handleKeyDown(e) {
		// Space key to enable panning mode
		if (e.code === 'Space' && !isPanning) {
			container.style.cursor = 'grab';
		}

		// Keyboard shortcuts for zooming
		if (e.ctrlKey || e.metaKey) {
			if (e.key === '=' || e.key === '+') {
				e.preventDefault();
				zoomIn();
			} else if (e.key === '-') {
				e.preventDefault();
				zoomOut();
			} else if (e.key === '0') {
				e.preventDefault();
				resetZoom();
			}
		}
	}

	function handleKeyUp(e) {
		// Space key to disable panning mode
		if (e.code === 'Space') {
			container.style.cursor = 'default';
		}
	}

	function resetZoom() {
		scale = 1;
		panX = 0;
		panY = 0;
	}

	function zoomIn() {
		const newScale = Math.min(maxZoom, scale * 1.2);
		// Keep center point centered when zooming with buttons
		if (container) {
			const centerX = container.clientWidth / 2;
			const centerY = container.clientHeight / 2;
			const pointX = (centerX - panX) / scale;
			const pointY = (centerY - panY) / scale;
			scale = newScale;
			panX = centerX - pointX * newScale;
			panY = centerY - pointY * newScale;
		} else {
			scale = newScale;
		}
	}

	function zoomOut() {
		const newScale = Math.max(minZoom, scale / 1.2);
		// Keep center point centered when zooming with buttons
		if (container) {
			const centerX = container.clientWidth / 2;
			const centerY = container.clientHeight / 2;
			const pointX = (centerX - panX) / scale;
			const pointY = (centerY - panY) / scale;
			scale = newScale;
			panX = centerX - pointX * newScale;
			panY = centerY - pointY * newScale;
		} else {
			scale = newScale;
		}
	}

	// Function to center view on a specific node
	function centerOnNode(nodeId) {
		const node = $nodeDefinitions.find((n) => n.id === nodeId);
		if (!node || !container) return;

		const containerWidth = container.clientWidth;
		const containerHeight = container.clientHeight;

		// Calculate pan to center the node
		panX = containerWidth / 2 - node.position.x * scale - (nodeSize.width * scale) / 2;
		panY = containerHeight / 2 - node.position.y * scale - (nodeSize.height * scale) / 2;
	}

	// Navigate to a position
	function navigateTo(x, y) {
		if (!container) return;

		const containerWidth = container.clientWidth;
		const containerHeight = container.clientHeight;

		// Calculate pan to center the position
		panX = containerWidth / 2 - x * scale;
		panY = containerHeight / 2 - y * scale;
	}

	// Initialize
	onMount(() => {
		if (browser) {
			loadNodesFromDB();

			// Event catching for node interactions
			document.addEventListener('mousedown', handleNodeMouseDown, true); // Use capture phase

			// Add event listeners for pan-zoom
			container.addEventListener('mousedown', handleCanvasMouseDown);
			container.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
			container.addEventListener('wheel', handleWheel, { passive: false });
			window.addEventListener('keydown', handleKeyDown);
			window.addEventListener('keyup', handleKeyUp);

			// Touch events for mobile devices
			container.addEventListener('touchstart', handleTouchStart);
			container.addEventListener('touchmove', handleTouchMove, { passive: false });
			container.addEventListener('touchend', handleTouchEnd);

			// Add resize handler to maintain fitting
			window.addEventListener('resize', autoFit);
		}
	});

	// Clean up event listeners
	onDestroy(() => {
		if (browser) {
			document.removeEventListener('mousedown', handleNodeMouseDown, true);

			container.removeEventListener('mousedown', handleCanvasMouseDown);
			container.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
			container.removeEventListener('wheel', handleWheel);
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);

			container.removeEventListener('touchstart', handleTouchStart);
			container.removeEventListener('touchmove', handleTouchMove);
			container.removeEventListener('touchend', handleTouchEnd);

			window.removeEventListener('resize', autoFit);
		}
	});

	// Get component based on node type

	// Function to test navigation to a far-off position
	function gotoFarPosition() {
		navigateTo(11000, 800);
	}

	let socket: WebSocket | null = $state(null);

	let retryDelay = $state(1000); // start at 1s
	const maxDelay = 10000; // max 10s
	let shouldReconnect = $state(true);

	function connectWebSocket() {
		const url = `ws://[::]:3041/ws?filename=${$page.params.projectId}`;
		socket = new WebSocket(url);

		socket.addEventListener('open', () => {
			console.log('🔌 WebSocket connected');
			retryDelay = 1000; // reset delay on success
		});

		socket.addEventListener('message', async (event) => {
			try {
				const msg = JSON.parse(event.data);
				console.log('📨 WebSocket message:', msg.event);

				if (msg.event === 'node_config_change') {
					await loadNodesFromDB();
					// HOW TO RELOAD NODES HERE
					console.log('load nodes');
				}
			} catch (err) {
				console.error('❌ Failed to parse WebSocket message:', err);
			}
		});

		socket.addEventListener('error', (event) => {
			console.error('❗ WebSocket error:', event);
		});

		socket.addEventListener('close', () => {
			console.warn('🛑 WebSocket disconnected');
			if (shouldReconnect) {
				retryWebSocket();
			}
		});
	}

	function retryWebSocket() {
		setTimeout(() => {
			console.log(`♻️ Retrying WebSocket connection in ${retryDelay / 1000}s...`);
			retryDelay = Math.min(retryDelay * 2, maxDelay);
			connectWebSocket();
		}, retryDelay);
	}

	onMount(() => {
		connectWebSocket();

		return () => {
			shouldReconnect = false;
			if (socket) {
				socket.close();
			}
		};
	});

	onDestroy(() => {
		shouldReconnect = false;
		if (socket) {
			socket.close();
		}
	});
</script>

<!-- Project indicator -->
<div
	class="absolute bottom-4 left-4 z-10 rounded-md bg-white bg-opacity-80 px-3 py-1 text-sm shadow-sm"
>
	Project: {$page.params.projectId}
</div>

<!-- Zoom controls -->
<div
	class="zoom-controls absolute bottom-20 right-4 flex flex-col gap-2 rounded-md bg-white bg-opacity-80 p-2 shadow-sm"
>
	<button class="zoom-button" onclick={zoomIn} title="Zoom In (Ctrl +)"> + </button>
	<button class="zoom-button" onclick={autoFit} title="Fit All Nodes"> ⊡ </button>
	<button class="zoom-button" onclick={resetZoom} title="Reset View (Ctrl 0)"> ↻ </button>
	<button class="zoom-button" onclick={zoomOut} title="Zoom Out (Ctrl -)"> - </button>
	<!-- Test button for far position navigation -->
	<button class="zoom-button" onclick={gotoFarPosition} title="Go to (11000, 800)"> ⟿ </button>
</div>

<div class="absolute left-4 top-16 z-10 rounded-md bg-white bg-opacity-80 p-2 text-sm shadow-sm">
	<p>📋 <strong>Navigation Tips:</strong></p>
	<ul class="mt-1 list-disc pl-5">
		<li>Drag empty space to pan the canvas</li>
		<li>Drag any node to move it</li>
		<li>Scroll wheel to zoom in/out</li>
		<li>Touch users: Drag with one finger</li>
	</ul>
</div>

<ActivityPanel></ActivityPanel>
<Panel></Panel>
<CreateButton></CreateButton>

<style>
	.zoom-controls {
		z-index: 10;
	}

	.zoom-button {
		width: 30px;
		height: 30px;
		background-color: white;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 18px;
		line-height: 1;
		cursor: pointer;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.zoom-button:hover {
		background-color: #f3f4f6;
	}
</style>
