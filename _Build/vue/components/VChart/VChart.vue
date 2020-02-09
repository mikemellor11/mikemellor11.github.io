<template>
	<div>
		<div class="labD3">
			<table v-if="this.self.chart === 'Table'" ref="chart"></table>
		    <svg v-else ref="chart"></svg>
		</div>
		<ul ref="key" class="labD3 chart--key"></ul>
	</div>
</template>

<script src="./VChart.js"/>