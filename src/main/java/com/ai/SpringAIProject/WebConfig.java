package com.ai.SpringAIProject;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
	
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
				        .allowedOrigins( "http://localhost:3000",
                "https://spring-ai-recipe-generator-react.vercel.app")
				        .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
				        .allowedHeaders("*")
				        .allowCredentials(true);
			}
			
		};
	}

}

