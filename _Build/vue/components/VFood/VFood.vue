<template>
	<form
		class="food"
		v-on:submit.prevent="submit"
	>
	    <ul>
	        <li
	        	v-for="(food, key) in foods"
        	>
	            <label
	            	v-text="key"
	            />
	            <input 
	            	type="number"
	            	v-model.number="food.weight"
	            />
	        </li>
	    </ul>
	    <button class="button">Random meal plan</button>
	    <button type="submit" class="button">Save</button>
	</form>
</template>

<script src="./VFood.js"/>