package com.youngblood.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    private String [] contributors;
    private String [] skills;
    private String status;
    private String show_status;
    private String [] process;
    private Object [] timeline;
    private String name;
    private Integer rating;
    private String createdAt;
    private String updatedAt;
    private String description;
}
