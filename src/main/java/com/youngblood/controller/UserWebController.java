package com.youngblood.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
public class UserWebController {

    @GetMapping("/test")
    public void test(){
        System.out.println("hello");
    }

}
