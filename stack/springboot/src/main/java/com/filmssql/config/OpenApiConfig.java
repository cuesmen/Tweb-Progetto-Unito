package com.filmssql.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    /**
     * Configures the OpenAPI metadata shown in Swagger UI.
     * @return shared OpenAPI instance with basic API info.
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Film SQL API")
                .version("1.0.0")
                .description("API for MoviePoint backend in Springboot"));
    }
}
