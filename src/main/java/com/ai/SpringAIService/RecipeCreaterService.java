package com.ai.SpringAIService;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;



@Service
public class RecipeCreaterService {
	
	private final ChatModel chatModel;
	
	public RecipeCreaterService(ChatModel chatModel){
		this.chatModel=chatModel;
	}
	private static final Logger logger = LoggerFactory.getLogger(RecipeCreaterService.class);
	public String createRecipe(String ingredients,String cuisine,String dieteryRestrictions) {
		logger.info("Entered createRecipe {}");
		var template = """
				I want to create a recipe using the following ingredients :{ingredients}.
				The Cuisine type I Prefer is {cuisine}.
				Please consider the following dietery Restrictions : {dieteryRestrictions}.
				Please provide me with the detailed recipe including title , List of Ingredients and 
				Detailed Cooking Instructions
				""";
		PromptTemplate promptTemplate = new PromptTemplate(template);
		
		Map<String,Object> params = Map.of(
				"ingredients",ingredients,
				"cuisine",cuisine,
				"dieteryRestrictions",dieteryRestrictions);
		
		Prompt prompt = promptTemplate.create(params);
		
		return chatModel.call(prompt).getResult().getOutput().getText();
		
	}
	
	public String getCuisines(String continent) {
		logger.info("Entered Cuisines {}");
		var template = """
				Lsit only the cuisines that are native to the continent of :{continent}.
				Do not include any cuisines that originated outside of this continent
				Return ony the names of the native Cuisines """;
		PromptTemplate promptTemplate = new PromptTemplate(template);
		
		Map<String,Object> params = Map.of(
				"continent",continent);
		
		Prompt prompt = promptTemplate.create(params);
		
		return chatModel.call(prompt).getResult().getOutput().getText();
		
		
	}

}
