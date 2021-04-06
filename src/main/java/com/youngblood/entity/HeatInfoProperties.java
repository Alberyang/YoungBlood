package com.youngblood.entity;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "heatinfo")
@Primary
public class HeatInfoProperties {
    private int view_weight;
    private int review_weight;
    private int thumb_weight;
    private int ucb_valueA;
    private int ucb_valueB;
    private int return_nums;
    private long openId_outtime;
    private long snapshot_del_time;

}
