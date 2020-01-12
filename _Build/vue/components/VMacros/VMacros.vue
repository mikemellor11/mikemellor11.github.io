<template>
	<section>
		<h2>Macros</h2>
		<ul
			v-if="macros && foods"
			class="
				grid
				grid--quarters
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
						'active': macro.value > (macro.target - macro.margin.lower) && macro.value < (macro.target + macro.margin.upper),
						'deactive': macro.value > macro.target
					}"
				>
					<div
						class="
							card__body
						"
					>
						<span v-text="key"/>: 
						<span v-text="macro.value.toFixed(1)"/> - (
						<span v-text="macro.GDA"/> / 
						<span v-text="macro.target"/> ) - (
						<span v-text="macro.target - macro.margin.lower"/> - 
						<span v-text="macro.target + macro.margin.upper"/> )
					</div>
				</article>
			</li>
		</ul>
	</section>
</template>

<script src="./VMacros.js"/>