<template>
	<ul class="js-sidemenu">
	    <li
	    	v-for="(area, key) in exercises"
    	>
	        <h2 v-text="key"/>
	        <ul
	        	v-for="exercise in area"
        	>
	            <li>
	                <input
	                	:id="exercise.exercise"
	                	v-model="exercise.active"
	                	class="js-input group"
	                	type="checkbox"
                	/>
	                <label
	                	:for="exercise.exercise"
	                	v-text="exercise.exercise"
                	/>
	            </li>
	        </ul>
	    </li>
	</ul>
</template>

<script src="./VExercises.js"/>