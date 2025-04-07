<!-- src/lib/components/dash/welcome-screen.svelte -->

<div class="flex h-full w-full items-center justify-center bg-gray-50 p-6">
	<div class="max-w-md text-center">
		<h1 class="mb-4 text-3xl font-bold text-gray-800">Welcome to Your Project</h1>

		<p class="mb-6 text-gray-600">
			It looks like this project is empty. Let's get started by creating your first node!
		</p>

		<button
			class="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			Create First Node
		</button>

		<div class="mt-6 text-sm text-gray-500">
			<p>Not sure where to start?</p>
			<a href="/help-center" class="text-blue-600 underline hover:text-blue-800">
				Check out our getting started guide
			</a>
		</div>
	</div>
</div>
