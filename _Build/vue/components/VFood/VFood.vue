<template>
	<section>
		<h2>Food</h2>
		<form
			class="food"
			v-on:submit.prevent="submit"
		>
			<button
		    	class="button"
				v-on:click.prevent="reset(); random();"
	    	>
	    		Random meal plan
	    	</button>
	    	<button
		    	class="button"
				v-on:click.prevent="reset();"
	    	>
	    		Reset
	    	</button>
		    <button
		    	type="submit"
		    	class="button"
	    	>
	    		Save
	    	</button>

			<div class="form__group">
			    <label
			    	for="search"
			    	v-text="'Search'"
			    />
			    <input
			    	type="text"
	    			v-model="search"
			    	id="search"
			    	placeholder="Search"
			    	class="form__input"
			    	role="search"
		    	/>
			</div>

		    <ul
		    	class="
					ut-clearListOnly
		    	"
		    >
		        <li
		        	v-for="(food, key) in sorted"
	        	>
	        		<div class="form__group">
					    <label
					    	for="search"
					    	v-text="key"
					    />
					    <input
					    	type="number"
			    			v-model.number="food.weight"
					    	:step="food.multiple"
					    	id="search"
					    	placeholder="Search"
					    	class="form__input"
					    	role="search"
				    	/>
					</div>
		        </li>
		    </ul>
		</form>
	</section>
</template>

<script src="./VFood.js"/>