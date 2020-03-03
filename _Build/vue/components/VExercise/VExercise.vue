<template>
	<li>
		<h3
	    	v-text="exercise.title"
	    />

	    <form
	    	class="
	            grid
	            grid--gutters
	            grid--thirds
	        "
	        v-on:change="defaults"
		>
	        <div
	        	v-for="(value, key) in exercise.defaults"
	        >
	            <label
	            	v-text="key"
	            />
	            <input
	            	type="number"
	            	v-model.number="exercise.defaults[key]"
	            	step="0.25"
	        	/>
	        </div>
	    </form>
	    
	    <ul class="
	        grid
	        grid--thirds
	        grid--gutters
	        grid--vertGutters
	        ut-clearListOnly
	        ut-marginTop
	    ">
	        <li
	        	v-for="(stat, key) in stats"
	        >
	            <div class="
	                card
	                card--workout
	                ut-padding
	                ut-noWrap
	                ut-tableChildren
	            ">
	                <h3 v-text="key"/>
	                <p v-text="stat"/>
	            </div>
	        </li>
	    </ul>

	    <form 
	    	v-on:submit.prevent="onSubmit"
	    	class="
	        	js-submit
	        	ut-textAlignRight
	        	grid
	        	grid--gutters
	        	grid--halfs
	    	"
    	>
    		<div>
		        <label
	            	v-text="'Weight'"
	            />
	            <input
	            	type="number"
	            	v-model.number="result.weight"
	            	step="0.25"
	        	/>
	        </div>
			<div>
	        	<label
	            	v-text="'Reps'"
	            />
	            <input
	            	type="number"
	            	v-model.number="result.reps"
	            	step="0.25"
	        	/>
	        </div>

	        <button type="submit" class="button">Set done</button>
	    </form>
	</li>
</template>

<script src="./VExercise.js"/>