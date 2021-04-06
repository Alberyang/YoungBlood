package com.youngblood;

import com.youngblood.entity.HeatInfoProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync  //开启异步注解功能
@EnableScheduling //开启基于注解的定时任务
@EnableConfigurationProperties({HeatInfoProperties.class})
public class YoungBloodApplication {
    public static void main(String[] args) {
        SpringApplication.run(YoungBloodApplication.class, args);
    }
}
