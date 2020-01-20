<template>
	<ul class="
	    ut-tableChildren
	    ut-tableFixed
	    ut-clearListOnly
	">
		<template
	    	v-for="(area, key) in exercises"
    	>       
		    <li
		    	v-if="exercise.active"
	        	v-for="exercise in area"
	        	class="
		        	ut-paddingHorz
		    	"
	        >
		        <h3
		        	v-text="exercise.title"
		        />

		        <form
		        	class="
		                grid
		                grid--halfs
		            "
		            v-on:change="defaults(exercise, key)"
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
	                	v-for="(stat, key) in stats(exercise)"
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
		            <label>Weight</label>
		            <select class="js-actualWeight"></select>

		            <label>Reps</label>
		            <select class="js-actualReps"></select>

		            <button type="submit" class="button">Set done</button>
		        </form>
		    </li>
		</template>
	</ul>
</template>

<script src="./VWorkout.js"/>