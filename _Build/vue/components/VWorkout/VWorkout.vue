<template>
	<ul class="
	    ut-tableChildren
	    ut-tableFixed
	    ut-clearListOnly
	">
		<template
	    	v-for="(area, key) in exercises"
    	>       
		    <VExercise
		    	v-if="exercise.active"
	        	v-for="exercise in area"
	        	class="
		        	ut-paddingHorz
		    	"
		    	:area="key"
		    	:exercise="exercise"
	        />
		</template>
	</ul>
</template>

<script src="./VWorkout.js"/>