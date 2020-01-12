<template>
	<section>
		<h2>Meal plan</h2>
		<ul
			class="
				ut-clearListOnly
			"
		>
			<li
				v-for="item in shopping"
			>
				<p>{{item.key}}: <span v-text="item.weight"/>g</p>
			</li>
		</ul>
	</section>
</template>

<script src="./VShopping.js"/>