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
		        	v-text="exercise.exercise"
		        />

		        <!-- <form
		        	class="
		                js-config
		                grid
		                grid--halfs
		            "
		    	>
		            {{#each (array
		                "Sets"
		                "Peak"
		                "Start Percent"
		                "End percent"
		                "Max"
		                "Increase"
		                "Reps"
		                "Inc interval"
		                "Equipment weight"
		            )}}
		                <div>
		                    <label>{{this}}</label>
		                    <select class="js-{{camel this}}"></select>
		                </div>
		            {{/each}}
		        </form> -->
		        
		        <!-- <ul class="
		            grid
		            grid--halfs
		            grid--gutters
		            grid--vertGutters
		            ut-clearListOnly
		        ">
		            {{#each (array
		                "Last max"
		                "Volume"
		                "Increase session"
		                "Max session"
		                "Sets done"
		                "Sets left"
		                "Last"
		                "Target"
		                "Weight split"
		                "Next"
		            )}}
		                <li>
		                    <div class="
		                        card
		                        card--workout
		                        ut-padding
		                        ut-tableChildren
		                        ut-vertAlignChildrenMiddle
		                        ut-noWrap
		                    ">
		                        <h3>{{this}}</h3>
		                        <p class="js-{{camel this}}"></p>
		                    </div>
		                </li>
		            {{/each}}
		        </ul> -->

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