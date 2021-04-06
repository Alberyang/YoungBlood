package com.youngblood.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
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
