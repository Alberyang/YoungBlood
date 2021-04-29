package com.youngblood.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Experience{
    private String position;
    private String company;
    private String description;
    private String start_date;
    private String end_date;
}
