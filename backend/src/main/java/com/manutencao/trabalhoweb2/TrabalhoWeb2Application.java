package com.manutencao.trabalhoweb2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TrabalhoWeb2Application {

	public static void main(String[] args) {
		SpringApplication.run(TrabalhoWeb2Application.class, args);
	}

}
