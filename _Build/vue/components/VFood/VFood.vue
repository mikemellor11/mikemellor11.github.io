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
		    		grid
		    		grid--fulls
		    		grid--vertGutters
					ut-clearListOnly
		    	"
		    >
		        <li
		        	v-for="(food, key) in sorted"
	        	>
	        		<article class="
						card
	        		">
		        		<div class="card__body form__group">
						    <label
						    	:for="key"
						    >
						    	{{key | capitalize}}
							</label>

							<ul>
								<li
									v-for="(detail, key) in macros"
									class="highlight"
									:class="{
										'deactive': percent(key, food[key]) > 20,
										'active': percent(key, food[key]) > 10
									}"
								>
									<span v-text="`${key}: `"/><span v-text="`${food[key]} (${percent(key, food[key])}%)`"/>
								</li>
							</ul>

						    <input
						    	type="number"
				    			v-model.number="food.weight"
						    	:step="food.multiple"
						    	:id="key"
						    	placeholder="Search"
						    	class="form__input"
						    	role="textbox"
					    	/>
						</div>
					</article>
		        </li>
		    </ul>
		</form>
	</section>
</template>

<script src="./VFood.js"/>