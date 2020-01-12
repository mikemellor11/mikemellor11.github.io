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
				class="shopping"
			>
				<p>{{item.key}}: <span v-text="item.weight"/>g</p>

				<ul>
					<li v-for="(macro, key) in macros">{{key}}: <span v-text="((item[key] / 100) * item.weight).toFixed(1)"/></li>
				</ul>
			</li>
		</ul>
	</section>
</template>

<script src="./VShopping.js"/>