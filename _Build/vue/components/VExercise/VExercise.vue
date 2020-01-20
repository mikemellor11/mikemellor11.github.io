<template>
	<li>
		<h3
	    	v-text="exercise.title"
	    />

	    <form
	    	class="
	            grid
	            grid--halfs
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
	        	/>
	        </div>
	    </form>
	    
	    <ul class="
	        grid
	        grid--halfs
	        grid--gutters
	        grid--vertGutters
	        ut-clearListOnly
	    ">
	        <li
	        	v-for="(stat, key) in stats"
	        >
	            <div class="
	                card
	                card--workout
	                ut-padding
	                ut-noWrap
	            ">
	                <h3 v-text="key"/>
	                <p v-text="stat"/>
	            </div>
	        </li>
	    </ul>

	    <form class="
	        js-submit
	        ut-textAlignRight
	    ">
	        <label
            	v-text="'Weight'"
            />
            <input
            	type="number"
            	v-model.number="result.weight"
        	/>

        	<label
            	v-text="'Reps'"
            />
            <input
            	type="number"
            	v-model.number="result.reps"
        	/>

	        <button type="submit" class="button">Set done</button>
	    </form>
	</li>
</template>

<script src="./VExercise.js"/>