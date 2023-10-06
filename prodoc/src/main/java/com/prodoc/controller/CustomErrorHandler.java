package com.prodoc.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CustomErrorHandler implements ErrorController{
	
    @GetMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
		
		return "err.html";
    }
}
