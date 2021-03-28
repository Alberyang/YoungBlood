package com.youngblood.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users {
    private String username;
    private String email;
    private String salt;
    private String hash;
    private String bio;
    private String firstname;
    private String lastname;
    private String major;
    private String createdAt;
    private String updatedAt;
    private String aboutSection;
    private String headline;
    private String linkedin;
    private String location;
    private String website;
    private String graduation; //毕业时间
    private List<Experience> experienceList; // 经历集
    private List<Project> projects; //作品集

}
