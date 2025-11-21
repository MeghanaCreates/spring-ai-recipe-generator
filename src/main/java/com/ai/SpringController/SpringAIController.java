package com.ai.SpringController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.SpringAIService.RecipeCreaterService;

@RestController
@RequestMapping("/springAI")
public class SpringAIController {
	
	RecipeCreaterService recipeService;
	
	public SpringAIController(RecipeCreaterService recipeService) {
		this.recipeService = recipeService;
	}
	private static final Logger logger = LoggerFactory.getLogger(SpringAIController.class);
	@GetMapping("/recipe-creater")
	public String createRecipe(@RequestParam String ingredients, 
							@RequestParam String cuisine,
							@RequestParam String dieteryRestrictions) {
		logger.info("Entered Recipe Creater {}");
		return recipeService.createRecipe(ingredients, cuisine, dieteryRestrictions);
		
	}
	
	@GetMapping("/cuisinesacross")
	public String getCuisines(String continent) {
		logger.info("Entered Cuisines {}");
		return recipeService.getCuisines(continent);
		
	}

}
