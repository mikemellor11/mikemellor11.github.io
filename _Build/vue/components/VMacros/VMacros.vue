<template>
	<section>
		<h2>Macros</h2>
		<ul
			class="
				grid
				grid--thirds
				grid--gutters
				grid--vertGutters
				ut-clearListOnly
			"
		>
			<li
				v-for="(macro, key) in macros"
			>
				<article
					class="card"
					:class="{
						'card--good': macro.value > (macro.target - macro.margin.lower) && macro.value < (macro.target + macro.margin.upper),
						'card--warn': macro.value > (macro.target * 0.5),
						'card--bad': macro.value > (macro.target + macro.margin.upper)
					}"
				>
					<div
						class="
							card__body
						"
					>
						<h3 v-text="key"/>
						<p>Current: <span v-text="macro.value.toFixed(1)"/></p>
						<p>GDA: <span v-text="macro.GDA"/></p>
						<p>Target: <span v-text="macro.target"/></p>
						<p>Min: <span v-text="macro.target - macro.margin.lower"/></p>
						<p>Max: <span v-text="macro.target + macro.margin.upper"/></p>
					</div>
				</article>
			</li>
		</ul>
	</section>
</template>

<script src="./VMacros.js"/>