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
		    <ul
		    	class="
					ut-clearListOnly
		    	"
		    >
		        <li
		        	v-for="(food, key) in foods"
	        	>
		        	<h3>
		            	<label
		            		v-text="key"
		            	/>
		            </h3>
		            <input 
		            	type="number"
		            	v-model.number="food.weight"
		            />
		        </li>
		    </ul>
		</form>
	</section>
</template>

<script src="./VFood.js"/>